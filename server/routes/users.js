const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
//Load user model for email exist checking
const keys = require("../config/keys");
const User = require("../models/User");
const passport = require("passport");

//Load input  validation
const validateRegisterInput = require("../validation/register");
const validateLoginInput = require("../validation/login");

// @route  GET   api/users/register
// @desc   Register users route
// @access Public

router.post("/users/register", (req, res) => {
  const { errors, isValid } = validateRegisterInput(req.body);
  console.log(req.body);
  // Check Validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      errors.email = "Email already exists";
      return res.status(400).json(errors);
    } else {
      const avatar = gravatar.url(req.body.email, {
        s: "200", //Size
        r: "pg", //Rating
        d: "mm" //Default
      });

      const newUser = new User({
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        password: req.body.password,
        role: req.body.role
      });

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then(user => res.json(user))
            .catch(err => console.log(err));
        });
      });
    }
  });
});

// @route  GET   api/users/login
// @desc   Login users route => returning jwt token
// @access Public

router.post("/users/login", (req, res) => {
  const { errors, isValid } = validateLoginInput(req.body);

  // Check Validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  const email = req.body.email;
  const password = req.body.password;

  //Find user by email
  User.findOne({ email }).then(user => {
    if (!user) {
      errors.email = "User not found";
      return res.status(404).json(errors);
    }
    //check password
    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        //User Match

        //Create jt payload
        const payload = {
          id: user.id,
          first_name: user.first_name,
          last_name: user.last_name,
          avatar: user.avatar,
          role: user.role
        };
        //Sign token
        jwt.sign(
          payload,
          keys.secretOrKey,
          { expiresIn: 3600 },
          (err, token) => {
            res.json({
              path:"/",
              success: true,
              token: "Bearer " + token,
              first_name: user.first_name,
              last_name: user.last_name,
              user:user
            });
          },
        );
      } else {
        errors.password = "Password incorrect";
        return res.status(400).json(errors);
      }
    });
  });
});

// @route  GET   api/users/current
// @desc   Return/retrive the current user from the token
// @access Private

router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    // res.json(req.user);
    res.json({
      id: req.body.id,
      first_name: req.body.first_name,
      email: req.body.email
    });
  }
);

router.get("/users", (req, res) => {
  //var decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)

  User.find()
      .then(doc => {
         // res.setHeader('Access-Control-Expose-Headers', 'Content-Range');
          res.setHeader('Content-Range', 'users 0-5/5');
          res.json(doc)
          
      })
      .catch(err => {
          res.status(500).json(err)
      })
      
          
})

router.post('/user', (req, res)=>{
  //req.body
  if(!req.body){
      return res.status(400).send("request body is missing")
  }

  let model=new User(req.body)
  model.save()
  .then(doc=>{
      if(!doc ||doc.length===0){
          return res.status(500).send(doc)
      }
      res.status(200).send(doc)

  })
  .catch(err=>{
      res.status(500).json(err)
  })
})

router.post('/user/find', async (req, res) => {
  try {
    const user = await User.findOne({
      _id: req.body.userId
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    console.log(user);
    res.status(200).json({ user });
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


router.post('/user/update', async (req, res) => {
  try {
    const {
      first_name,
      last_name,
      email,
      github_id,
      linkedin_id,
      bio,
      website,
      _id
    } = req.body;
    // console.log(github_id);

    const updatedUserData = {
      first_name,
      last_name,
      email,
      githubId:github_id, // Match this field name with your Mongoose model
      linkedinId:linkedin_id, // Match this field name with your Mongoose model
      bio,
      website,
    };

    const updatedUser = await User.findByIdAndUpdate(_id, updatedUserData, { new: true });

    if (updatedUser) {
      res.status(200).json({ message: "Updated Successfully", user: updatedUser });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});


router.delete('/user', (req, res) => {
  //var decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)

  User.findOneAndRemove({
      // _id: req.query.id
      _id: req.body.id
  })
      .then(doc => {
          
          res.json(doc)
          
      })
      .catch(err => {
          res.status(500).json(err)
      })
})


module.exports = router;
