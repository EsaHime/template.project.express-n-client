/**
 * This is where the html template strings are stored.
 */
const templates: Record<string, string> = {
}

const getTemplate = (pageName: string): string => {
  return templates[pageName]
}

const setTemplate = (pageName: string, templateStr: string) => {
  templates[pageName] = templateStr
}

export {
  getTemplate,
  setTemplate
}
