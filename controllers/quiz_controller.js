var models = require('../models/models.js');

// Autoload - factoriza el código si ruta incluye :quizId
exports.load = function(req, res, next, quizId) {
  models.Quiz.find(quizId).then(
    function(quiz){
      if (quiz) {
        req.quiz = quiz;
        next();
      } else {
        next(new Error('No existe quizId=' + quizId));
      }
    }
  ).catch(function(error) { next(error); });
};

/* GET /quizzes */
exports.index = function(req, res) {
  var texto = req.query.search;
  if (texto === undefined) {
    texto = '';
  } else {
    texto = '%' + texto.replace(' ','%') + '%';
  }
  models.Quiz.findAll({
    where: ['pregunta like ?', texto],
    order:'pregunta ASC'
  }).then(function(quizzes){
    res.render('quizzes/index.ejs', { quizzes: quizzes, errors:[] });
  }).catch(function(error){ next(error);});
};

/* GET /quizzes/:id */
exports.show = function(req, res) {
  res.render('quizzes/show', { quiz: req.quiz, errors:[] });
};

/* GET /quizzes/:id/answer */
exports.answer = function(req, res) {
  var resultado = 'Incorrecto';
  if (req.query.respuesta === req.quiz.respuesta) {
      resultado = 'Correcto';
  }
  res.render('quizzes/answer', { quiz: req.quiz, respuesta: resultado, errors:[]});
};

/* GET /quizzes/new */
exports.new = function(req, res) {
  var quiz = models.Quiz.build( // crea objeto build
    { pregunta: 'Pregunta', respuesta: 'Respuesta'}
  );

  res.render('quizzes/new', { quiz: quiz, errors:[]});
};

/* POST /quizzes/create */
exports.create = function(req, res) {
  var quiz = models.Quiz.build( req.body.quiz );
  quiz.validate().then(function(err){
    if (err) {
      res.render('quizzes/new', {quiz: quiz, errors: err.errors});
    } else {   // guarda en DB los campos pregunta y respuesta de quiz
      quiz.save({ fields: ['pregunta', 'respuesta']}).then(function(){
        res.redirect('/quizzes'); // redirección HTTP (URL relativo) lista de preguntas
      });
    }
  });
};

/* GET /quizzes/:id/edit */
exports.edit = function(req, res) {
  var quiz = req.quiz; // autoload de instancia de quiz
  res.render('quizzes/edit', {quiz: quiz, errors: []});
};

/* PUT /quizzes/:id */
exports.update = function(req, res) {
  req.quiz.pregunta = req.body.quiz.pregunta;
  req.quiz.respuesta = req.body.quiz.respuesta;

  req.quiz.validate().then(function(err){
    if (err) {
      res.render('quizzes/edit', {quiz: req.quiz, errors: err.errors});
    } else {
      req.quiz.save({ fields: ['pregunta', 'respuesta']}).then(function(){
        res.redirect('/quizzes'); // redirección HTTP (URL relativo) lista de preguntas
      });
    }
  });
};

/* DELETE /quizzes/:id */
exports.destroy = function(req, res) {
  req.quiz.destroy().then( function() {
    res.redirect('/quizzes');
  }).catch(function(error){ next(error) });
};
