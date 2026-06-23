import jestOpenAPI from "jest-openapi";
import path from "path";

const openApiSpecPath = path.resolve(__dirname, "../../../swagger.json");
jestOpenAPI(openApiSpecPath);

jest.setTimeout(30000);
