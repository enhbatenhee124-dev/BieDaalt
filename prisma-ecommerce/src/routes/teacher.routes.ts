import { Router } from 'express';
import { teacherController } from '../controllers/teacher.controller.ts';

export const teacherRoutes = Router();

teacherRoutes.get('/', teacherController.list);
teacherRoutes.get('/:id', teacherController.getById);
teacherRoutes.post('/', teacherController.create);
teacherRoutes.put('/:id', teacherController.update);
teacherRoutes.delete('/:id', teacherController.remove);
