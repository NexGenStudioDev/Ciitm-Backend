import { Router } from 'express';
import RoleController from './Role.controller.mjs';
import AuthMiddleware from '../../../middleware/Auth.middleware.mjs';

const routes = Router();

// Create/Grant admin role
routes.post(
  '/v1/role/create',
  AuthMiddleware.Admin,
  RoleController.Create_Admin_Role_Controller
);

// List all portal administrators
routes.get(
  '/v1/role/list',
  AuthMiddleware.Admin,
  RoleController.Get_All_Admins_Controller
);
routes.get(
  '/v1/admin/list',
  AuthMiddleware.Admin,
  RoleController.Get_All_Admins_Controller
);

// Revoke/Delete admin role
routes.delete(
  '/v1/role/delete/:email',
  AuthMiddleware.Admin,
  RoleController.Delete_Admin_Role_Controller
);
routes.delete(
  '/v1/admin/delete/:id',
  AuthMiddleware.Admin,
  RoleController.Delete_Admin_Role_Controller
);

export { routes as RoleRouter };
