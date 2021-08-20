"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const User_1 = require("../model/User");
const bcryptjs = __importStar(require("bcryptjs"));
const jwt = __importStar(require("jsonwebtoken"));
const EmailValidator = __importStar(require("email-validator"));
const config_1 = require("./../config/config");
const router = express_1.Router();
router.get('/', (req, res) => __awaiter(this, void 0, void 0, function* () {
}));
router.get('/authenticated', requireAuth, (req, res) => __awaiter(this, void 0, void 0, function* () {
    return res.status(200).send({ auth: true, message: 'Authenticated.' });
}));
router.get('/:id', requireAuth, (req, res) => __awaiter(this, void 0, void 0, function* () {
    let { id } = req.params;
    const item = yield User_1.User.findByPk(id);
    if (!item) {
        return res.status(400).send('User not found');
    }
    res.send(item);
}));
function comparePasswords(plainTextPassword, hash) {
    return __awaiter(this, void 0, void 0, function* () {
        //@TODO Use Bcrypt to Compare your password to your Salted Hashed Password
        return yield bcryptjs.compare(plainTextPassword, hash);
        //return await bcrypt.compare(plainTextPassword, hash);
    });
}
function generateJWT(user) {
    //@TODO Use jwt to create a new JWT Payload containing
    return jwt.sign({ email: user.email, password: user.password_hash }, config_1.config.jwt, { algorithm: 'HS256' });
}
router.post('/login', (req, res) => __awaiter(this, void 0, void 0, function* () {
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
    const user = yield User_1.User.findByPk(email);
    // check that user exists
    if (!user) {
        return res.status(401).send({ auth: false, message: 'Unauthorized' });
    }
    // check that the password matches
    const authValid = yield comparePasswords(password, user.password_hash);
    if (!authValid) {
        return res.status(401).send({ auth: false, message: 'Unauthorized' });
    }
    // Generate JWT
    const jwt = generateJWT(user);
    res.status(200).send({ auth: true, token: jwt, user: user.short() });
}));
function requireAuth(req, res, next) {
    // return next();
    if (!req.headers || !req.headers.authorization) {
        return res.status(401).send({ message: 'No authorization headers.' });
    }
    const token = req.headers.authorization;
    return jwt.verify(token, config_1.config.jwt, (err, decoded) => {
        if (err) {
            return res.status(500).send({ auth: false, message: 'Failed to authenticate.' });
        }
        console.log(`--- Decoded user is ${decoded.email}`);
        return next();
    });
}
exports.requireAuth = requireAuth;
exports.UserRouter = router;
//# sourceMappingURL=router.js.map