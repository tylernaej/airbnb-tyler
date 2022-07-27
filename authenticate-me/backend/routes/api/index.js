// backend/routes/api/index.js
const router = require('express').Router();         //const express = require('express');
                                                    //const router = express.Router();

// backend/routes/api/index.js
// ...

router.post('/test', function(req, res) {
    res.json({ requestBody: req.body});
  });

  // ...

module.exports = router;
