import { Router, Request, Response } from 'express';

import { User } from '../model/User';
import * as bcryptjs from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import * as EmailValidator from 'email-validator';
import { config } from './../config/config';
import { NextFunction } from 'connect';

const router: Router = Router();

router.get('/', async (req: Request, res: Response) => {
});

router.get('/authenticated', 
    requireAuth, 
    async (req: Request, res: Response) => {
        return res.status(200).send({ auth: true, message: 'Authenticated.' });
});


router.get('/:id', requireAuth, async (req: Request, res: Response) => {
    let { id } = req.params;
    const item = await User.findByPk(id);
    if (!item) {
        return res.status(400).send('User not found');
    }
    
    res.send(item);
});

async function comparePasswords(plainTextPassword: string, hash: string): Promise<boolean> {
    //@TODO Use Bcrypt to Compare your password to your Salted Hashed Password
    return await bcryptjs.compare(plainTextPassword, hash);
    //return await bcrypt.compare(plainTextPassword, hash);
}

function generateJWT(user: User): string {
    //@TODO Use jwt to create a new JWT Payload containing
    return jwt.sign({email:user.email, password:user.password_hash}, config.jwt, { algorithm: 'HS256'});
}

router.post('/login', async (req: Request, res: Response) => {
    const email = req.body.email;
    const password = req.body.password;
    
    // check email is valid
    if (!email || !EmailValidator.validate(email)) {
        return res.status(400).send({ auth: false, message: 'Email is required or malformed' });
    }

    // check email password valid
    if (!password) {
        return res.status(400).send({ auth: false, message: 'Password is required' });
    }

    const user = await User.findByPk(email);
    // check that user exists
    if(!user) {
        return res.status(401).send({ auth: false, message: 'Unauthorized' });
    }

    // check that the password matches
    const authValid = await comparePasswords(password, user.password_hash)

    if(!authValid) {
        return res.status(401).send({ auth: false, message: 'Unauthorized' });
    }

    // Generate JWT
    const jwt = generateJWT(user);


    res.status(200).send({ auth: true, token: jwt, user: user.short()});
});

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  
    // return next();
     if (!req.headers || !req.headers.authorization){
         return res.status(401).send({ message: 'No authorization headers.' });
    }
    
    const token= req.headers.authorization;
    
     return jwt.verify(token, config.jwt, (err, decoded) => {
       if (err) {
         return res.status(500).send({ auth: false, message: 'Failed to authenticate.' });
      }
      console.log(`--- Decoded user is ${decoded.email}`);
      
      return next();
     });
}

export const UserRouter: Router = router;