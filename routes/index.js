var express = require('express');
var router = express.Router();

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

var admin = require("firebase-admin");

var serviceAccount = require('../fcmCert.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://react-s3-file-upload-fe079-default-rtdb.firebaseio.com"
});

/* GET home page. */
router.get('/', function (req, res, next) {
  res.status(200).json({message: 'up and running'})
});

router.post('/notification/sendViaFcm', (req, res) => {
  const { deviceFcmToken, dataToBeSend } = req.body;
  if(!deviceFcmToken || !dataToBeSend) res.status(400).json({error: "deviceFcmToken or dataToBeSend can not be null"})
  
  const data = {
    message: {
      token: deviceFcmToken,
      // notification: {
      //   title: "Notification Title",
      //   body: "Notification Body ",
      // },
      data: {...dataToBeSend, notificationId: Date.now().toString()}
    },
  };

  admin.messaging().send(data.message)
    .then(function (response) {
      res.send(response)
    })
    .catch(function (error) {
      res.send(error)
    });

})

router.get('/acknowlege/:notificationId', (req, res) => {
  console.log("Acknowledged on server: ", req.params.notificationId);
  res.status(200).json({message: "Successfully acknowledged id: " + req.params.notificationId});
})


module.exports = router;
