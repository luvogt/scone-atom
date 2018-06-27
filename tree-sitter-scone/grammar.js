module.exports = grammar({
  name: 'scone',

  //externals: $ => [$._newline],

  rules: {
    // The production rules of the context-free grammar

    //Main Structure
    source_file: $ => seq(
      $.feature, optional($.background), repeat($.scenario)
    ),
    feature: $ => seq(
      repeat($.tag), 'Feature:', $.title, '\n', $.narrative //$._newline
    ),
    title: $ => /.+/,
    narrative: $ => /.+/,   //[^]
    background: $ => seq(
      'Background:', optional($.language_setting), repeat($.import)
    ),
    tag: $ => 'a space delinited string startng with @',
    language_setting: $ => seq(
      '* Language', $.language_ID
    ),
    language_ID: $ => choice('%OWL', '%CommonLogic'),
    import: $ => seq('* Test', optional('the ontology'), $.uriref),

    //Scenarios
    scenario: $ => seq(
      repeat($.tag), $.scenario_head, $.scenario_body
    ),
    scenario_head: $ => seq(
      'Scenario:', $.title, '\n', $.narrative,
      '\n', optional($.language_setting)
    ),
    /*scenario_body: $ => repeat1(seq(
      repeat($.assumption),
      repeat1($.test)
    )),*/
    scenario_body: $ => seq(
      repeat1($.assumption),
      repeat1($.test)
    ),
    assumption: $ => seq(
      $.given,
      $.sentence,
      optional('.')
    ),
    test: $ => seq(
      $.then,
      choice($.inference_test, $.consistency_test),
      optional('.')
    ),
    inference_test: $ => seq(
      $.infer_start,
      $.infer_sentence
    ),
    consistency_test: $ => seq(
      'the scenario is', $.consistency
    ),
    //Sentences
    sentence: $ => choice(
      $.definition, $.proposition, $.fact, $.source
    ),
    infer_sentence: $ => choice(
      $.definition, $.universal, $.fact//, $.source
    ),
    definition: $ => choice(
      seq($.pos_class, $.is_defined_as, $.class_expression),
      seq($.class_name, 'is enumerated as', $.indiv_name, repeat(seq('and', $.indiv_name)))
    ),
    proposition: $ => choice($.universal, $.particular),
    universal: $ => choice($.universal_positve, $.universal_negative),
    universal_positve: $ => choice(
      seq(
        'every', $.class_name, 'is', $.class_expression
      ),
      seq(
        $.class_name, 'is a subclass of', $.class_expression
      )
    ),
    universal_negative: $ => choice(
      seq(
        'no', $.class_name, 'is a', $.class_expression
      ),
      seq(
        $.class_name, repeat1('and', $.class_name), 'are disjoint'
      )
    ),
    particular: $ => seq(
      'some', $.class_name, choice('are','aren\'t'), $.class_expression
    ),
    fact: $ => choice(
      $.instance, $.relation, $.equation, $.different
    ),
    instance: $ => seq(
      $.indiv_name, choice('is','isn\'t'), $.class_expression
    ),
    relation: $ => seq(
      $.indiv_name, $.predicate_phrase, $.indiv_name
    ),
    equation: $ => seq(
      $.indiv_name, choice('is','isn\'t'), 'the same as', $.indiv_name
    ),
    different: $ => seq(
      $.indiv_name, repeat1(seq('and', $.indiv_name)), $.are_different
    ),
    are_different: $ => 'are different', //#####
    source: $ => seq(
      $.language_ID, $.delimiter, $.source_body, $.delimiter
    ),
    source_body: $ => repeat1(choice(     //'some syntactically valid expression in the identified ontology language'
      /[^"]/,
      /"[^"]/,
      /""[^"]/
    )),
    delimiter: $ => '"""', // EOL fehlt (für Syntaxhighlighting nicht wichtig?) seq('\n', '"""', '\n') funktioniert nicht wie gewünscht


    //Terms
    class_expression: $ => choice(
      $.class_atom//, $.conjunction, $.disjunction, $.qualified_class
    ),
    pos_class: $ => seq(
      optional(choice('a','an')), $.class_name
    ),
    class_atom: $ => seq(optional('not'), $.pos_class),
    predicate_phrase: $ => choice(
      seq($.predicate_open, $.predicate_name),
      seq(choice('is','isn\'t'), optional(choice('a','an','the')),
          $.predicate_fragement, $.predicate_end)
    ),
    predicate_open: $ => choice(
      'does',
      'doesn\'t',
      seq(choice('has', 'hasn\'t'), 'as') //was soll das heißen?
    ),
    predicate_end:$ => choice(
      'of', 'than', 'to', 'on', 'in'
    ),


    class_name: $ => $.qname,
    predicate_name: $ => $.qname,
    predicate_fragement: $ => $.qname,
    //indiv: $ => $.qname,
    indiv_name: $ => prec(1,$.qname),   //prec(1,
    qname: $ => 'qname',
    uriref: $ => 'uriref',
    //---------------------
    given: $ => 'Given',
    then: $ => 'Then',
    consistency: $ => choice('consistent','inconsistent'),
    is_defined_as: $ => 'is defined as',
    infer_start: $ => seq(
      optional('don\'t'),
      'infer',
      optional('that')
    )

  }
});
