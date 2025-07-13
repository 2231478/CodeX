import express from 'express';
import http from 'http';
import path from 'path';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import { createClient } from 'redis';
import { WebSocketServer } from 'ws';
import { fileURLToPath } from 'url';
import multer from 'multer';
import 'dotenv/config';
import dbHelper from './modules/dbHelper.js';
import captchaHelper from './modules/captchaHelper.js';
import emailModule from './modules/email.js';
import jwtHelper from './modules/jwtHelper.js';
import userModule from './modules/user.js';
import profileModule from './modules/profile.js';
import reservationModule from './modules/reservation.js';
import facilityModule from './modules/facility.js';
import specialServiceModule from './modules/specialService.js';
import dashboardModule from './modules/dashboard.js';
import { Status } from './constants.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '.env') });

const port = process.env.PORT || 3000;
const secretKey = process.env.SESSION_KEY;
const dbConnectionString = process.env.DB_CONN;
const upload = multer({ storage: multer.memoryStorage() });
const __clientPath = path.join(__dirname, '../client');

dbHelper.connect(dbConnectionString);

const app = express();
app.use(express.json());

const redisClient = createClient({
  url: process.env.REDIS_URL
});
redisClient.on('error', (err) => console.error('Redis Client Error', err));
await redisClient.connect();

const basicLimiter = rateLimit({
    windowMs: 1000, 
    max: 10, 
    message: {
        error: 'Too many requests, please try again after a minute.'
    }
});

const uploadImage = multer({ storage: multer.memoryStorage() }).single('image');
const uploadLetter = multer({ storage: multer.memoryStorage() }).single('letterOfIntentFile');

// const verificationLimiter = rateLimit({
//     windowMs: 60 * 60 * 1000, // 1 hour
//     max: 3, // limit each IP to 3 request per windowMs
//     message: {
//         error: 'Too many requests, please try again after a minute.'
//     }
// });

const processGetAPI = async (req, res) => {
    const { module, action, id } = req.params;
    const data = { ...req.body, ...req.query };
    switch (module) {
        case 'user':
            switch (action) {
                // case 'verify-verification-code': {
                //     let responseData = await userModule.verifyVerificationCode(dbHelper, data);
                //     if (responseData.status === Status.OK) {
                //         return res.redirect('../../email-verification-success.html');
                //     }
                //     return res.status(responseData.status).json(responseData);
                // }
                case 'profile': {
                    let responseData = await userModule.getUser(dbHelper, req.user);
                    let profileResponseData = await profileModule.getProfile(dbHelper, req.user);
                    profileResponseData.data = { ...responseData.data, ...profileResponseData.data };
                    return res.status(profileResponseData.status).json(profileResponseData);
                }
                default:
                    return res.status(404).json({ error: 'Unknown action' });
            }
          case 'facility':
            switch (action) {
                case 'get-all-facilities': {
                    let responseData = await facilityModule.getAllFacilities(dbHelper);
                    return res.status(responseData.status).json(responseData);
                }
                case 'get-facility-by-id': {
                    let responseData = await facilityModule.getFacilityById(dbHelper, id);
                    return res.status(responseData.status).json(responseData);
                }
                case 'get-facilities-by-type': {
                    let responseData = await facilityModule.getFacilitiesByType(dbHelper, id);
                    return res.status(responseData.status).json(responseData);
                }
                case 'get-available-dates-by-facility': {
                    let responseData = await facilityModule.getAvailableDatesByFacility(dbHelper, id);
                    return res.status(responseData.status).json(responseData);
                }
                default:
                    return res.status(404).json({ error: 'Unknown action' });
            }
          case 'special-service':
            switch (action) {
                case 'get-all-special-services': {
                    let responseData = await specialServiceModule.getAllSpecialServices(dbHelper);
                    return res.status(responseData.status).json(responseData);
                }
                case 'get-special-service-by-id': {
                    let responseData = await specialServiceModule.getSpecialServiceById(dbHelper, id);
                    return res.status(responseData.status).json(responseData);
                }
                default:
                    return res.status(404).json({ error: 'Unknown action' });
            }
          case 'reservation':
            switch (action) {
                case 'get-reservation-by-user-id': {
                    let responseData = await reservationModule.getReservationByUserId(dbHelper, req.user);
                    return res.status(responseData.status).json(responseData);
                }
                default:
                    return res.status(404).json({ error: 'Unknown action' });
            }
          case 'dashboard':
                switch (action) {
                  case 'get-todays-reservations-count': {
                      let responseData = await dashboardModule.getTodaysReservationCount(dbHelper, req.user);
                      return res.status(responseData.status).json(responseData);
                  }
                  case 'get-monthly-check-ins-count': {
                      let responseData = await dashboardModule.getMonthlyCheckInsCount(dbHelper, req.user);
                      return res.status(responseData.status).json(responseData);
                  }
                  default:
                      return res.status(404).json({ error: 'Unknown action' });
                }
        default:
            return res.status(404).json({ error: 'Unknown module' });
    }
};

const processPostAPI = async (req, res) => {
    const { module, action, id } = req.params;
    const data = { ...req.body, ...req.query };
    switch (module) {
        case 'user':
            switch (action) {
                case 'register': {
                    // let responseData = captchaHelper.verifyCaptcha(data.captcha, req.session);
                    // let verificationCode = Math.floor(100000 + Math.random() * 900000);
                    // if (responseData.status === Status.OK) {
                    //     responseData = await userModule.register(dbHelper, req.session, data, verificationCode);
                    // }
                    // if (responseData.status === Status.OK) {
                    //     await profileModule.create(dbHelper, responseData.userId);
                    //     await emailModule.sendVerificationCode(data.email, verificationCode);
                    // }
                    // captchaHelper.resetCaptcha(req.session);
                    // return res.status(responseData.status).json(responseData);
                    let responseData = await userModule.register(dbHelper, data);
                    if (responseData.status === Status.OK) {
                        await profileModule.createProfile(dbHelper, responseData.userId);
                    }
                    return res.status(responseData.status).json(responseData);
                }
                // case 'resend-verification-code': {
                //     let responseData = captchaHelper.verifyCaptcha(data.captcha, req.session);
                //     if (responseData.status === Status.OK) {
                //         responseData = await userModule.getVerificationCode(dbHelper, data.email);
                //     }
                //     if (responseData.status === Status.OK) {
                //         responseData = await emailModule.sendVerificationCode(data.email, responseData.verificationCode);
                //     }
                //     captchaHelper.resetCaptcha(req.session);
                //     return res.status(responseData.status).json(responseData);
                // }
                case 'login': {
                    // let responseData = captchaHelper.verifyCaptcha(data.captcha, req.session);
                    // // if (responseData.status === Status.OK) {
                    // //     responseData = await userModule.login(dbHelper, req.session, data);
                    // // }
                    // // captchaHelper.resetCaptcha(req.session);
                    // return res.status(responseData.status).json(responseData);
                    let responseData = await userModule.login(dbHelper, data);
                    return res.status(responseData.status).json(responseData);
                }
                case 'google-login': {
                    let responseData = await userModule.googleLogin(dbHelper, data);  
                    return res.status(responseData.status).json(responseData);
                }
                case 'facebook-login': {
                    let responseData = await userModule.facebookLogin(dbHelper, data);
                    return res.status(responseData.status).json(responseData);
                }
                case 'logout': {
                    let responseData = await userModule.logout(req.session);
                    return res.status(responseData.status).json(responseData);
                }
                case 'profile': {
                    let profileResponseData = await profileModule.updateProfile(dbHelper, req.session, data);
                    return res.status(profileResponseData.status).json(profileResponseData);
                }
                case 'profile-picture': {
                    let profileResponseData = await profileModule.updateProfilePic(dbHelper, req.session, data);
                    return res.status(profileResponseData.status).json(profileResponseData);
                }
                case 'change-password': {
                    let responseData = await userModule.changePassword(dbHelper, req.session, data);
                    return res.status(responseData.status).json(responseData);
                }
                case 'send-password-reset-verification-code': {
                    const responseData = await userModule.sendPasswordResetVerificationCode(dbHelper, emailModule, data);
                    return res.status(responseData.status).json(responseData);
                }
                case 'reset-password': {
                    const responseData = await userModule.resetPassword(dbHelper, data);
                    return res.status(responseData.status).json(responseData);
                }
                default:
                    return res.status(404).json({ error: 'Unknown action' });
            }
        case 'reservation':
            switch (action) {
                case 'create-reservation': {
                    let responseData = await reservationModule.addReservation(dbHelper, data, req.file, req.user);
                    return res.status(responseData.status).json(responseData);
                }
                case 'cancel-booking': {
                    let responseData = await reservationModule.cancelBooking(dbHelper, id, req.user);
                    return res.status(responseData.status).json(responseData);
                }
                default:
                    return res.status(404).json({ error: 'Unknown action' });
            }
        case 'facility':
            switch (action) {
              case 'create-facility': {
                let responseData = await facilityModule.addFacility(dbHelper, data, req.file, req.user);
                return res.status(responseData.status).json(responseData);
              }
              case 'update-facility': {
                let responseData = await facilityModule.updateFacility(dbHelper, id, data, req.file, req.user);
                return res.status(responseData.status).json(responseData);
              }
              case 'delete-facility': {
                let responseData = await facilityModule.deleteFacility(dbHelper, id, req.user);
                return res.status(responseData.status).json(responseData);
              }
              default:
                return res.status(404).json({ error: 'Unknown action' });
            }
        case 'special-service':
            switch (action) {
                case 'create-special-service': {
                    let responseData = await specialServiceModule.addSpecialService(dbHelper, data, req.user);
                    return res.status(responseData.status).json(responseData);
                }
                case 'update-special-service': {
                    let responseData = await specialServiceModule.updateSpecialService(dbHelper, id, data, req.user);
                    return res.status(responseData.status).json(responseData);
                }
                case 'delete-special-service': {
                    let responseData = await specialServiceModule.deleteSpecialService(dbHelper, id, req.user);
                    return res.status(responseData.status).json(responseData);
                }
                default:
                    return res.status(404).json({ error: 'Unknown action' });
            }
        default:
            return res.status(404).json({ error: 'Unknown module' });
    }
};

function authenticateJWT(req, res, next) {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    const user = jwtHelper.verifyAccessToken(token);
    if (!user) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user; 
    next();
  } else {
    res.status(401).json({ error: 'Authorization header missing or malformed' });
  }
}

function isProtected(module, action) {
  const protectedEndpoints = {
    user: ['profile', 'logout', 'change-password'],
    profile: ['update', 'uploadPicture'],
    reservation: ['create-reservation', 'get-reservation-by-user-id', 'cancel-booking'],
    facility: ['create-facility', 'update-facility', 'delete-facility'],
    'special-service': ['create-special-service', 'update-special-service', 'delete-special-service'],
    dashboard: ['get-todays-reservations-count', 'get-monthly-check-ins-count']
  };
  return protectedEndpoints[module] && protectedEndpoints[module].includes(action);
}

// const sessionParser = session({
//   store: new RedisStore({ client: redisClient, prefix: 'sess:' }),
//   secret: process.env.SESSION_KEY,
//   resave: false,
//   saveUninitialized: false,
//   cookie: {
//     maxAge: 30 * 60 * 1000 * 24, 
//     secure: process.env.NODE_ENV === 'production',
//     httpOnly: true
//   }
// });

// app.use(sessionParser);

app.use(express.static(__clientPath));

app.get('/', (req, res) => {
    res.sendFile(path.join(__clientPath, 'index.html'));
});

// app.get('/api/auth/captcha', basicLimiter, async (req, res) => {
//     res.json(await captchaHelper.handleCaptcha(req.session));
// });

// app.get('/api/user/verify-verification-code', verificationLimiter, async (req, res) => {
//     req.params.module = 'user';
//     req.params.action = 'verify-verification-code';
//     await processGetAPI(req, res);
// });

app.get('/api/:module/:action', basicLimiter, (req, res, next) => {
  if (isProtected(req.params.module, req.params.action)) {
    authenticateJWT(req, res, () => processGetAPI(req, res));
  } else {
    processGetAPI(req, res);
  }
});

app.post('/api/:module/:action', basicLimiter, (req, res, next) => {
  const { module, action } = req.params;
  if (module === 'reservation' && action === 'create-reservation') {
    uploadLetter(req, res, (err) => {
      if (err) return res.status(400).json({ error: 'File upload error', details: err.message });
      if (isProtected(module, action)) {
        authenticateJWT(req, res, () => processPostAPI(req, res));
      } else {
        processPostAPI(req, res);
      }
    });
  }

  else if (module === 'facility' && (action === 'create-facility' || action === 'update-facility')) {
    uploadImage(req, res, (err) => {
      if (err) return res.status(400).json({ error: 'File upload error', details: err.message });
      if (isProtected(module, action)) {
        authenticateJWT(req, res, () => processPostAPI(req, res));
      } else {
        processPostAPI(req, res);
      }
    });
  }
  else {
    if (isProtected(module, action)) {
      authenticateJWT(req, res, () => processPostAPI(req, res));
    } else {
      processPostAPI(req, res);
    }
  }
});


app.get('/api/:module/:action/:id', basicLimiter, (req, res, next) => {
  if (isProtected(req.params.module, req.params.action)) {
    authenticateJWT(req, res, () => processGetAPI(req, res));
  } else {
    processGetAPI(req, res);
  }
});

app.post('/api/:module/:action/:id', basicLimiter, (req, res, next) => {
  const { module, action } = req.params;

  if (module === 'reservation' && action === 'update-reservation') {
    uploadLetter(req, res, (err) => {
      if (err) return res.status(400).json({ error: 'File upload error', details: err.message });
      if (isProtected(module, action)) {
        authenticateJWT(req, res, () => processPostAPI(req, res));
      } else {
        processPostAPI(req, res);
      }
    });
  }
  else if (module === 'facility' && (action === 'update-facility' || action === 'create-facility')) {
    uploadImage(req, res, (err) => {
      if (err) return res.status(400).json({ error: 'File upload error', details: err.message });
      if (isProtected(module, action)) {
        authenticateJWT(req, res, () => processPostAPI(req, res));
      } else {
        processPostAPI(req, res);
      }
    });
  }
  else {
    if (isProtected(module, action)) {
      authenticateJWT(req, res, () => processPostAPI(req, res));
    } else {
      processPostAPI(req, res);
    }
  }
});

app.use((req, res) => {
    res.redirect('../error-404.html');
});

const server = http.createServer(app);
const wss = new WebSocketServer({ noServer: true });

server.on('upgrade', (req, socket, head) => {
  sessionParser(req, {}, () => {
    if (!req.session.userId) {
      socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
      socket.destroy();
      return;
    }
    wss.handleUpgrade(req, socket, head, ws => wss.emit('connection', ws, req));
  });
});

wss.on('connection', (ws, req) => {
  const userId = req.session.userId;
  console.log(`New client connected: ${userId}`);
  ws.on('message', msg => ws.send(`Hello ${userId}, you sent -> ${msg}`));
  ws.on('close', () => console.log(`Client ${userId} has disconnected`));
});

server.listen(port, () => {
    console.log(`API listening at http://localhost:${port}`);
});