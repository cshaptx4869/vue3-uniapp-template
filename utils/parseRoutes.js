import pagesJson from "@/pages.json";

if (!pagesJson.pages) {
  pagesJson.pages = [];
}
if (!pagesJson.subPackages) {
  pagesJson.subPackages = [];
}

function parsePages(pages = [], rootPath = "") {
  let routes = [];
  for (let i = 0; i < pages.length; i++) {
    routes.push({
      path: rootPath ? `/${rootPath}/${pages[i].path}` : `/${pages[i].path}`,
      needLogin: pages[i].needLogin === true,
    });
  }
  return routes;
}

function parseSubPackages(subPackages = []) {
  let routes = [];
  for (let i = 0; i < subPackages.length; i++) {
    routes = routes.concat(
      parsePages(subPackages[i].pages, subPackages[i].root)
    );
  }
  return routes;
}

export const routes = [
  ...parsePages(pagesJson.pages),
  ...parseSubPackages(pagesJson.subPackages),
];

export default routes;
