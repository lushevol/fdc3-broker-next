import { registerApplication, start } from 'single-spa';
import { constructApplications, constructLayoutEngine, constructRoutes } from 'single-spa-layout';
import microfrontendLayout from './microfrontend-layout.html';

const root = () => {
  const routes = constructRoutes(microfrontendLayout);
  const applications = constructApplications({
    routes,
    loadApp({ name }) {
      return System.import(name);
    },
  });
  const layoutEngine = constructLayoutEngine({ routes, applications });
  applications.forEach((mfe) => {
    mfe.customProps = {
      publicUrl: `/`,
    };
    registerApplication(mfe);
  });
  layoutEngine.activate();
  start();
};
root();
export default root;
