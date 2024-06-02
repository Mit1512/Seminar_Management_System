// server.js
const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const { body, validationResult } = require('express-validator');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { Student ,Guide, Coordinator,Ppt3} = require('./models-mongo'); // Import the MongoDB models

const app = express();
app.use(bodyParser.json());
app.use(cors());

const JWT_SECRET = "mit132334#@$$$";
const DB_URL = 'mongodb://0.0.0.0/main';

mongoose.connect(DB_URL, { useNewUrlParser: true, useUnifiedTopology: true });

const conn = mongoose.connection;

conn.once('open', () => {
    console.log("***********Mongo DB connected**********");
});

// signup actual student
app.post('/studentpost', [
    // Validate the name field
    body('name').notEmpty().isLength({ max: 255 }),

    // Validate the email field
    body('email').notEmpty().isEmail(),

    // Validate the password field
    body('cpassword').notEmpty().isLength({ min: 1 }),

    // Validate the confirm password field
    body('confirmPassword').custom((value, { req }) => {
        if (value !== req.body.cpassword) {
            throw new Error('Password confirmation does not match password');
        }
        return true;
    }),
], async (req, res) => {
    var success = false;

    // Check if there are any validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success, errors: errors.array() });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.cpassword, salt);

    // Insert the user data into MongoDB
    const { name, email, cpassword, confirmPassword } = req.body;

    Student.create({ name, email, cpassword: hashedPassword, confirmPassword })
        .then((student) => {
            const payload = { id: student._id }; // MongoDB uses _id instead of id
            const token = jwt.sign(payload, JWT_SECRET);
            console.log(token);
            success = true;
            res.status(201).json({ success, student, token });
        })
        .catch((error) => {
            console.log("Error :", error);
            res.status(500).json({ success, error: "Internal Server Error" });
        });
});


  
// signup actual guide
app.post('/guidepost', [
    // Validate the name field
    body('name').notEmpty().isLength({ max: 255 }),

    // Validate the email field
    body('email').notEmpty().isEmail(),

    // Validate the password field
    body('cpassword').notEmpty().isLength({ min: 1 }),

    // Validate the confirm password field
    body('confirmPassword').custom((value, { req }) => {
        if (value !== req.body.cpassword) {
            throw new Error('Password confirmation does not match password');
        }
        return true;
    }),
], async (req, res) => {
    var success = false;
    // Check if there are any validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success, errors: errors.array() });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.cpassword, salt);

    // Insert the user data into MongoDB
    const { name, email, cpassword, confirmPassword } = req.body;

    Guide.create({ name, email, cpassword: hashedPassword, confirmPassword })
        .then((guide) => {
            const payload = { id: guide._id }; // MongoDB uses _id instead of id
            const token = jwt.sign(payload, JWT_SECRET);
            console.log(token);
            success = true;
            res.status(201).json({ success, guide, token });
        })
        .catch((error) => {
            console.log("Error :", error);
            res.status(500).json({ success, error: "Internal Server Error" });
        });
});


 // signup actaul coordinator
 app.post('/coordinatorpost', [
    // Validate the name field
    body('name').notEmpty().isLength({ max: 255 }),
  
    // Validate the email field
    body('email').notEmpty().isEmail(),
  
    // Validate the password field
    body('cpassword').notEmpty().isLength({ min: 1 }),
  
    // Validate the confirm password field
    body('confirmPassword').custom((value, { req }) => {
      if (value !== req.body.cpassword) {
        throw new Error('Password confirmation does not match password');
      }
      return true;
    }),
  ], async  (req, res) => {
    var success=false;
    // Check if there are any validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({success, errors: errors.array() });
    }
  
   // Hash the password
   const salt = await bcrypt.genSalt(10);
   const hashedPassword = await bcrypt.hash(req.body.cpassword, salt);
  
  
    // Insert the user data into the MySQL database
    const { name, email, cpassword  ,confirmPassword } = req.body;
   
    Coordinator.create({ name, email, cpassword : hashedPassword ,confirmPassword })
    .then((coordinators) => {
      const payload = { id: coordinators.id };
      const token = jwt.sign(payload, JWT_SECRET);
      console.log(token);
      success=true;
              res.status(201).json({success,coordinators,token});
            })
            .catch((error) => {
             console.log("Error :",error);
                });
   
  });


  


// login actaul // student
app.post('/login', async (req, res) => {
    var success = false;
    const { email, cpassword } = req.body;
  
    
  
    // Find the user in the MongoDB database
    const user = await Student.findOne({ email: email });
    if (!user) {
      return res.status(400).json({ success, message: 'Invalid credentials' });
    }
  
    // Compare the password with the hashed password in the database
    const isValidPassword = await bcrypt.compare(cpassword, user.cpassword);
    if (!isValidPassword) {
      return res.status(400).json({ success, message: 'Invalid credentials' });
    }
  
    console.log('Request body:', req.body);
    console.log('User found in MongoDB:', user);
    console.log('isValidPassword:', isValidPassword);
    
  
  
    // Create and send a JWT token as a response
    success = true;
    const payload = { id: user._id };
    const token = jwt.sign(payload, JWT_SECRET);
    res.json({ success, token });
  });
  
  // login actaul guide
  app.post('/guidelogin', async (req, res) => {
    var success = false;
    const { email, cpassword } = req.body;
  
    // Find the user in the MongoDB database
    const user = await Guide.findOne({ email: email });
    if (!user) {
      return res.status(400).json({ success, message: 'Invalid credentials' });
    }
  
    // Compare the password with the hashed password in the database
    const isValidPassword = await bcrypt.compare(cpassword, user.cpassword);
    if (!isValidPassword) {
      return res.status(400).json({ success, message: 'Invalid credentials' });
    }
  
    // Create and send a JWT token as a response
    success = true;
    const payload = { id: user._id }; // MongoDB uses _id instead of id
    const token = jwt.sign(payload, JWT_SECRET);
    res.json({ success, token });
  });
  
  
  
    // login actaul // co
    app.post('/cologin', async (req, res) => {
        var success = false;
        const { email, cpassword } = req.body;
      
        // Find the user in the MongoDB database
        const user = await Coordinator.findOne({ email: email });
        if (!user) {
          return res.status(400).json({ success, message: 'Invalid credentials' });
        }
      
        // Compare the password with the hashed password in the database
        const isValidPassword = await bcrypt.compare(cpassword, user.cpassword);
        if (!isValidPassword) {
          return res.status(400).json({ success, message: 'Invalid credentials' });
        }
      
        // Create and send a JWT token as a response
        success = true;
        const payload = { id: user._id }; // MongoDB uses _id instead of id
        const token = jwt.sign(payload, JWT_SECRET);
        res.json({ success, token });
      });

      const { Review1 , Review1Results,Review3Results,Ppt,Review2Results,SelectedPair } = require('./models-mongo'); // Import the MongoDB models
      
      app.post('/topicpost', async (req, res) => {
        var success = false;
      
        // Insert the user data into the MongoDB database
        const { guideEmail, studentEmail, topic1, topic2, topic3 } = req.body;
      
        Review1.create({ guideEmail, studentEmail, topic1, topic2, topic3 })
          .then((review1) => {
            success = true;
            res.status(201).json({ success, review1 });
          })
          .catch((error) => {
            success = false;
            console.log("Error hai:", error);
            res.status(500).json({ success, error: "Internal Server Error" });
          });
      });
      

      app.post('/gettopics', async (req, res) => {
        const { studentEmail } = req.body;
        const { guideEmail } = req.body;
      
        try {
          const reviews = await Review1.find({
            studentEmail: studentEmail,
            guideEmail: guideEmail
          });
      
          res.send(reviews);
        } catch (error) {
          console.log(error);
          res.status(500).send('Error retrieving reviews from database');
        }
      });

      const multer = require('multer');
      const fs = require('fs');
      const path = require('path');
        const storage = multer.diskStorage({
          destination: (req, file, cb) => {
            cb(null, 'D:\\seminar\\server\\uploads');
          },
          filename: (req, file, cb) => {
            const fileName = `${Date.now()}-${file.originalname}`;
            cb(null, fileName);
          }
        });
      
      const upload = multer({
        storage: storage,
        fileFilter: (req, file, cb) => {
          if (
            file.mimetype === 'application/vnd.ms-powerpoint' ||
            file.mimetype === 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
          ) {
            cb(null, true);
          } else {
            cb(new Error('Invalid file type. Only ppt and pptx files are allowed.'));
          }
        }
      }).single('ppt');

      app.post('/getppt3', async (req, res) => {
        try {
          const { studentEmail, guideEmail } = req.body;
          
          const pptData = await Ppt3.find({
            studentEmail: studentEmail,
            guideEmail: guideEmail
          });
      
          res.send(pptData);
        } catch (error) {
          console.log(error);
          res.status(500).send('Error retrieving ppt3 data from database');
        }
      });


      app.post('/result_1', async (req, res) => {
        var success = false;
      
        // Insert the user data into MongoDB
        const { email, topic, marks } = req.body;
      
        Review1Results.create({ email, topic, marks })
          .then((result_1) => {
            success = true;
            res.status(201).json({ success, result_1 });
          })
          .catch((error) => {
            console.log("Error :", error);
            res.status(500).json({ success, error: "Internal Server Error" });
          });
      });
      
      app.post('/getresult1', async (req, res) => {
        try {
          const email = req.body.email;
          
          // Find data in MongoDB
          const results = await Review1Results.find({ email: email });
      
          // Convert Mongoose documents to plain JavaScript objects
          const result = results.map(doc => doc.toObject());
      
          res.send(result);
        } catch (error) {
          console.log(error);
          res.status(500).send('Error retrieving data from database');
        }
      });


      app.post('/sendppt', async (req, res) => {
        upload(req, res, async (err) => {
          if (err) {
            console.error(err.message);
            return res.status(400).send(err.message);
          }
      
          // File is uploaded successfully
          const ppt = req.file;
          const guideEmail = req.body.guideEmail;
          const filename = req.body.filename;
          const studentEmail = req.body.studentEmail;
      
          // Save file information to MongoDB
          const pptData = fs.readFileSync(path.join(__dirname, `uploads/${ppt.filename}`));
          const pptModel = new Ppt({
            guideEmail: guideEmail,
            studentEmail: studentEmail,
            filename: filename,
            pptData: pptData
          });
      
          try {
            const result = await pptModel.save();
            res.status(201).json({ success: true, result });
          } catch (error) {
            console.error("Error:", error);
            res.status(500).json({ success: false, message: 'Error storing file in MongoDB' });
          }
        });
      });
      
      // MongoDB query for getting ppts
      app.post('/getppt', async (req, res) => {
        const { studentEmail, guideEmail } = req.body;
        try {
          const result = await Ppt.find({ studentEmail: studentEmail, guideEmail: guideEmail });
          res.send(result);
        } catch (error) {
          console.error(error);
          res.status(500).send('Error retrieving data from MongoDB');
        }
      });

      app.post('/sendppt3', (req, res) => {
        upload(req, res, async (err) => {
          if (err) {
            console.error(err.message);
            return res.status(400).send(err.message);
          }
      
          // File is uploaded successfully
          const ppt = req.file;
          const guideEmail = req.body.guideEmail;
          const filename = req.body.filename;
          const studentEmail = req.body.studentEmail;
      
          // Save file information to MongoDB
          const pptData = fs.readFileSync(path.join(__dirname, `uploads/${ppt.filename}`));
          try {
            const result = await Ppt3.create({ guideEmail, studentEmail, filename, pptData });
            res.status(201).json({ success: true, result });
          } catch (error) {
            console.log("Error:", error);
            res.status(500).json({ success: false, message: 'Error storing file in MongoDB' });
          }
        });
      });

      app.post('/getppt3', async (req, res) => {
        try {
          const email = req.body.email;
      
          // Assuming Ppt3 model has a field 'studentEmail' for filtering
          const result = await Ppt3.find({ studentEmail: email });
      
          res.send(result);
        } catch (error) {
          console.log(error);
          res.status(500).json({ message: 'Error retrieving data from MongoDB' });
        }
      });


      app.post('/entermarks', async (req, res) => {
        try {
          var success = false;
      
          // Destructure the data from the request body
          const { email, marks } = req.body;
      
          // Create a new document in MongoDB using Mongoose
          const result_2 = await Review2Results.create({ email, marks });
      
          // Set success to true and send the response
          success = true;
          res.status(201).json({ success, result_2 });
        } catch (error) {
          console.log("Error: ", error);
          res.status(500).json({ success: false, error: "Internal Server Error" });
        }
      });


      app.post('/getresult2', async (req, res) => {
        try {
          const email = req.body.email;
      
          // Find documents in MongoDB using Mongoose
          const result_2 = await Review2Results.find({ email });
      
          // Send the response
          res.status(200).json(result_2);
        } catch (error) {
          console.log("Error: ", error);
          res.status(500).json({ message: 'Server error' });
        }
      });


      app.post('/entermarks3', async (req, res) => {
        try {
          const { email, marks } = req.body;
      
          // Create a new document in MongoDB using Mongoose
          const result_3 = await Review3Results.create({ email, marks });
      
          // Send the response
          res.status(201).json({ success: true, result_3 });
        } catch (error) {
          console.log("Error: ", error);
          res.status(500).json({ success: false, error: "Internal Server Error" });
        }
      });


      app.post('/getresult3', async (req, res) => {
        try {
          const email = req.body.email;
      
          // Find documents in MongoDB using Mongoose
          const results = await Review3Results.find({ email });
      
          // Send the response
          res.send(results);
        } catch (error) {
          console.log(error);
          res.status(500).json({ message: 'Server error' });
        }
      });
    

      app.post('/store-selected-pair', async (req, res) => {
        const { studentId, student_name, student_email, guideId, guide_name, guide_email } = req.body;
      
        try {
          // Insert the selected pair data into MongoDB using Mongoose
          await SelectedPair.create({
            studentId,
            student_name,
            student_email,
            guideId,
            guide_name,
            guide_email
          });
    
          
          // Send the response
          return res.status(200).json({ message: 'Selected pair stored successfully' });
        } catch (error) {
          console.error(error);
          return res.status(500).json({ message: 'Internal server error' });
        }
      });


      app.get('/get-students', async (req, res) => {
        try {
          // Retrieve all students from MongoDB using Mongoose
          const students = await Student.find();
      
          // Send the response
          res.send(students);
        } catch (error) {
          console.error(error);
          res.status(500).send('Error retrieving students');
        }
      });


      app.get('/get-guides', async (req, res) => {
        try {
          // Retrieve all guides from MongoDB using Mongoose
          const guides = await Guide.find();
      
          // Send the response
          res.send(guides);
        } catch (error) {
          console.error(error);
          res.status(500).send('Error retrieving guides');
        }
      });


      app.get('/get-pair', async (req, res) => {
        try {
          // Retrieve all selected pairs from MongoDB using Mongoose
          const selectedPairs = await SelectedPair.find();
      
          // Send the response
          res.send(selectedPairs);
        } catch (error) {
          console.error(error);
          res.status(500).send('Error retrieving selected pairs');
        }
      });


      app.post('/getpair', async (req, res) => {
        try {
          const guideEmail = req.body.guideEmail;
      
          // Retrieve selected pairs for the specified guideEmail from MongoDB using Mongoose
          const selectedPairs = await SelectedPair.find({ guide_email: guideEmail });
      
          // Send the response
          res.send(selectedPairs);
        } catch (error) {
          console.error(error);
          res.status(500).send('Error retrieving selected pairs');
        }
      });
      

      app.post('/get_pair', async (req, res) => {
        try {
          const studentEmail = req.body.studentEmail;
      
          // Retrieve selected pairs for the specified studentEmail from MongoDB using Mongoose
          const selectedPairs = await SelectedPair.find({ student_email: studentEmail });
      
          // Send the response
          res.send(selectedPairs);
        } catch (error) {
          console.error(error);
          res.status(500).send('Error retrieving selected pairs');
        }
      });
      
app.listen(5000, () => {
console.log(`Server is running at http://localhost:5000`);
    });