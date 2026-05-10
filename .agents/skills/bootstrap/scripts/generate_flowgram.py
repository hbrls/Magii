#!/usr/bin/env python3
"""
Generate FlowGram.ai DAG YAML from Vision Plan Tree YAML.

Usage:
    python generate_flowgram.py <input.yaml> <output.yaml>

Input: Vision Plan Tree YAML (flat dict keyed by plan id)
Output: FlowGram.ai DAG YAML (nodes array with start/condition/task/end)
"""
import sys
import yaml


def to_node_id(plan_id: str) -> str:
    return plan_id.replace('.', '_').lower()


def quote(s: str) -> str:
    if ':' in s or '"' in s or "'" in s or '#' in s or '\n' in s:
        return '"' + s.replace('"', '\\"') + '"'
    return s


def process_plan(plan_id: str, plan_tree: dict) -> list:
    plan = plan_tree[plan_id]
    children = plan.get('children') or []

    if not children:
        return [{
            'id': to_node_id(plan_id),
            'type': 'task',
            'data': {
                'title': f'{plan_id}: {plan["name"]}',
            },
            'blocks': [],
        }]

    branches = []
    for child_id in children:
        branches.append({
            'id': f'branch_{to_node_id(child_id)}',
            'type': 'block',
            'data': {'title': f'{child_id} Branch'},
            'blocks': process_plan(child_id, plan_tree),
        })

    return [
        {
            'id': f'condition_{to_node_id(plan_id)}',
            'type': 'condition',
            'data': {'title': 'Split'},
            'blocks': branches,
        },
        {
            'id': to_node_id(plan_id),
            'type': 'task',
            'data': {
                'title': f'{plan_id}: {plan["name"]}',
            },
            'blocks': [],
        },
    ]


def build_dag(plan_tree: dict) -> dict:
    root_id = None
    for pid, plan in plan_tree.items():
        parent = plan.get('parent')
        if not parent or parent == 'none':
            root_id = pid
            break

    if not root_id:
        print('Error: no root plan found (parent is null/none)', file=sys.stderr)
        sys.exit(1)

    root_plan = plan_tree[root_id]
    root_children = root_plan.get('children') or []

    nodes = [{'id': 'start_0', 'type': 'start', 'data': {'title': 'Start'}, 'blocks': []}]

    if root_children:
        branches = []
        for child_id in root_children:
            branches.append({
                'id': f'branch_{to_node_id(child_id)}',
                'type': 'block',
                'data': {'title': f'{child_id} Branch'},
                'blocks': process_plan(child_id, plan_tree),
            })
        nodes.append({
            'id': f'condition_{to_node_id(root_id)}',
            'type': 'condition',
            'data': {'title': 'Split'},
            'blocks': branches,
        })

    nodes.append({
        'id': to_node_id(root_id),
        'type': 'end',
        'data': {'title': f'{root_id}: {root_plan["name"]}'},
    })

    return {'nodes': nodes}


def represent_str(dumper, data):
    if ':' in data or '"' in data or "'" in data or '#' in data or '\n' in data:
        return dumper.represent_scalar('tag:yaml.org,2002:str', data, style='"')
    return dumper.represent_scalar('tag:yaml.org,2002:str', data)


class CustomDumper(yaml.SafeDumper):
    pass


CustomDumper.add_representer(str, represent_str)


def main():
    if len(sys.argv) < 3:
        print('Usage: python generate_flowgram.py <input.yaml> <output.yaml>', file=sys.stderr)
        sys.exit(1)

    input_path = sys.argv[1]
    output_path = sys.argv[2]

    with open(input_path, 'r') as f:
        plan_tree = yaml.safe_load(f)

    dag = build_dag(plan_tree)

    with open(output_path, 'w') as f:
        yaml.dump(dag, f, Dumper=CustomDumper, default_flow_style=False, allow_unicode=True, sort_keys=False)

    print(f'Generated: {output_path}')


if __name__ == '__main__':
    main()
