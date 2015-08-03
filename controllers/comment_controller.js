var models = require('../models/models.js');

/* GET /quizzes/:quizId/comments/new */
exports.new = function(req, res) {
  res.render('comments/new.ejs', { quizid: req.params.quizId, errors:[]});
};

/* POST /quizzes/:quizId/comments */
exports.create = function(req, res) {
  var comment = models.Comment.build (
      { texto: req.body.comment.texto,
        QuizId: req.params.quizId
      });
  comment.validate().then(function(err){
      if (err) {
        res.render('comments/new.ejs', {comment: comment, quizid: req.params.quizId, errors: err.errors});
      } else {   // guarda en DB el campo texto de comment
        comment.save().then(function(){
          res.redirect('/quizzes/' + req.params.quizId)});
      }
    }
  ).catch(function(error){ next(error) });
};

