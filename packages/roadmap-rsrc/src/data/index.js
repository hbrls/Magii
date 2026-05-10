const ctx = require.context('./', false, /\.yaml$/);

const dataMap = {};

ctx.keys().forEach((key) => {
  const fileName = key.replace(/^\.\//, '').replace(/\.yaml$/, '');
  const mod = ctx(key);
  dataMap[fileName] = mod.default || mod;
});

export function loadConfig(appId, planId) {
  const key = `${appId}-${planId}`;
  return dataMap[key] || null;
}
