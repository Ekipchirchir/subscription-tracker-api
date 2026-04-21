import {Router} from 'express';
import authorize from '../middlewares/auth.middleware.js'
import { createSubcription, getUserSubscriptions } from '../controllers/subscription.controller.js';

const subscriptionRouter = Router();

subscriptionRouter.get('/', (req, res) => res.send({title: "GET all subscriptions"}));

subscriptionRouter.get('/:id', (req, res) => res.send({title: "GET subscription details"}));

subscriptionRouter.post('/', authorize, createSubcription);

subscriptionRouter.put('/:id', (req, res) => res.send({title: "UPDATE subscription details"}));

subscriptionRouter.delete('/:id', (req, res) => res.send({title: "DELETE a subscription"}));

subscriptionRouter.get('/user/:id', authorize, getUserSubscriptions);

subscriptionRouter.put('/:id/cancel', (req, res) => res.send({title: "CANCEL a subscription"}));

subscriptionRouter.get('/', (req, res) => res.send({title: "GET all subscriptions"}));

subscriptionRouter.get('/upcoming-renewals', (req, res) => res.send({title: "GET all upcoming renewals"}));


export default subscriptionRouter;