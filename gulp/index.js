var modules = ['build', 'check', 'serve']

modules.forEach(module => require(`./${module}`))
