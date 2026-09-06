"""Mirrors services/gateway/test/expression.spec.ts — same restricted grammar, two independent
implementations, tested against the same real modules."""

from app.ontology.expression import evaluate_expression


def test_in_membership_against_array_valued_identifier():
    assert evaluate_expression("'neck_stiff' in associated", {"associated": ["neck_stiff", "headache"]}) is True
    assert evaluate_expression("'neck_stiff' in associated", {"associated": ["headache"]}) is False


def test_in_membership_against_list_literal():
    assert evaluate_expression("consciousness in ['drowsy','confused']", {"consciousness": "drowsy"}) is True
    assert evaluate_expression("consciousness in ['drowsy','confused']", {"consciousness": "normal"}) is False


def test_and_or_from_real_fever_yaml_expressions():
    ctx = {"associated": ["neck_stiff", "headache"]}
    assert evaluate_expression("'neck_stiff' in associated and 'headache' in associated", ctx) is True
    assert (
        evaluate_expression("'bleeding' in associated or ('rash' in associated and 'vomiting' in associated)", ctx)
        is False
    )


def test_numeric_comparison_from_chest_pain_yaml():
    ctx = {"character": "pressure", "associated": ["sweating"], "severity": 8}
    assert (
        evaluate_expression("character in ['pressure','tightness'] and 'sweating' in associated and severity >= 7", ctx)
        is True
    )
    assert evaluate_expression("severity >= 9", ctx) is False


def test_unfilled_slot_is_false_not_an_error():
    assert evaluate_expression("severity >= 7", {}) is False
    assert evaluate_expression("'x' in associated", {}) is False
    assert evaluate_expression("timing == 'recurrent'", {}) is False


def test_not_and_parentheses():
    assert evaluate_expression("not ('x' in tags)", {"tags": ["y"]}) is True
    assert evaluate_expression("not ('x' in tags)", {"tags": ["x"]}) is False
