"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Terms
from api.utils import generate_sitemap, APIException

api = Blueprint('api', __name__)


@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200


@api.route("/terms", methods=["GET"])
def get_all_terms():
    terms = Terms.query.all()
    # pasar cada uno de los elementos del conjunto de elementos que estamos recibiendo de nuestra tabla, a diccionario
    data = [term.serialize() for term in terms]
    return jsonify(data), 200


@api.route("/terms", methods=["POST"])
def add_term():
    # permitendo que podamos extraer la informacion de los datos que nos envia el usuario
    body = request.json
    # creamos un nuevo termino a partir de lo que nos envía el usuario
    new_term = Terms(term=body["term"], definition=body["definition"])
    db.session.add(new_term)  # decir que se va a añadir a la tabla
    db.session.commit()  # estamos almacenando la info en la tabla
    return jsonify({"msg": "new term added"}), 200


@api.route("/terms/<term>", methods=["GET"])
def get_one_term(term):
    data = Terms.query.filter_by(term=term).first()  # devuelve un solo termino
    if not data:
        return jsonify({"msg": "no term, add it!"}), 404
    return jsonify(data.serialize()), 200


@api.route("/terms/<int:id>", methods=["DELETE"])
def delete_term(id):
    term = Terms.query.filter_by(id=id).first()
    if not term:
        return jsonify({"msg": "no such term with that ID"}), 404
    db.session.delete(term)
    db.session.commit()
    return jsonify({"msg": "eliminado con éxito!"}), 200


@api.route("/terms/<term>", methods=["PUT"])
def update_term(term):
    body = request.json
    term_to_modify = Terms.query.filter_by(term=term).first()
    if not term_to_modify:
        return jsonify({"msg": "no such term with that name to modify"}), 404
    term_to_modify.term = body["term"]
    term_to_modify.definition = body["definition"]
    db.session.commit()
    return jsonify({"msg": "actualizado correctamente"})
