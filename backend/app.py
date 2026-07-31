from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import mysql.connector
from config import db_config
import os
from werkzeug.utils import secure_filename
import joblib
import pandas as pd
import bcrypt

app = Flask(
    __name__,
    static_folder="../frontend",
    static_url_path=""
)
CORS(app)

UPLOAD_FOLDER = "uploads"
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

model = joblib.load("model/model.pkl")


def get_db_connection():
    return mysql.connector.connect(**db_config)


@app.route("/")
def home():
    return app.send_static_file("index.html")
@app.route("/register", methods=["POST"])
def register():
    try:

        data = request.json

        full_name = data["full_name"]
        email = data["email"]
        mobile = data["mobile"]
        password = data["password"]

        hashed_password = bcrypt.hashpw(
            password.encode("utf-8"),
            bcrypt.gensalt()
        ).decode("utf-8")

        db = get_db_connection()
        cursor = db.cursor(dictionary=True)

        cursor.execute(
            "SELECT * FROM users WHERE email=%s",
            (email,)
        )

        existing = cursor.fetchone()

        if existing:
            cursor.close()
            db.close()

            return jsonify({
                "message": "Email already exists"
            }), 400

        cursor = db.cursor()

        cursor.execute(
            """
            INSERT INTO users
            (full_name,email,mobile,password,role)
            VALUES(%s,%s,%s,%s,%s)
            """,
            (
                full_name,
                email,
                mobile,
                hashed_password,
                "user"
            )
        )

        db.commit()

        cursor.close()
        db.close()

        return jsonify({
            "message": "User registered successfully"
        })

    except Exception as e:

        print(e)

        return jsonify({
            "message": str(e)
        }), 500
@app.route("/login", methods=["POST"])
def login():

    try:

        data = request.json

        email = data["email"]
        password = data["password"]

        db = get_db_connection()
        cursor = db.cursor(dictionary=True)

        cursor.execute(
            "SELECT * FROM users WHERE email=%s",
            (email,)
        )

        user = cursor.fetchone()

        cursor.close()
        db.close()

        if not user:

            return jsonify({
                "message": "Invalid email or password"
            }), 401

        if bcrypt.checkpw(
            password.encode("utf-8"),
            user["password"].encode("utf-8")
        ):

            return jsonify({

                "message": "Login successful",

                "user": {
                    "id": user["id"],
                    "full_name": user["full_name"],
                    "email": user["email"],
                    "role": user["role"]
                }

            })

        return jsonify({
            "message": "Invalid email or password"
        }), 401

    except Exception as e:

        print(e)

        return jsonify({
            "message": str(e)
        }), 500
@app.route("/add_property", methods=["POST"])
def add_property():

    try:

        property_name = request.form["property_name"]
        city = request.form["city"]
        area = request.form["area"]
        price = request.form["price"]
        bedrooms = request.form["bedrooms"]
        bathrooms = request.form["bathrooms"]
        sqft = request.form["sqft"]
        description = request.form["description"]

        image = request.files["image"]

        filename = secure_filename(image.filename)

        image.save(
            os.path.join(app.config["UPLOAD_FOLDER"], filename)
        )

        image_path = f"uploads/{filename}"

        db = get_db_connection()
        cursor = db.cursor()

        cursor.execute("""
        INSERT INTO properties
        (property_name,city,area,price,bedrooms,bathrooms,sqft,image,description)

        VALUES(%s,%s,%s,%s,%s,%s,%s,%s,%s)
        """, (
            property_name,
            city,
            area,
            price,
            bedrooms,
            bathrooms,
            sqft,
            image_path,
            description
        ))

        db.commit()

        cursor.close()
        db.close()

        return jsonify({
            "message": "Property Added Successfully"
        })

    except Exception as e:

        return jsonify({
            "message": str(e)
        }), 500
@app.route("/properties", methods=["GET"])
def get_properties():

    db = get_db_connection()
    cursor = db.cursor(dictionary=True)

    cursor.execute(
        "SELECT * FROM properties ORDER BY created_at DESC"
    )

    properties = cursor.fetchall()

    cursor.close()
    db.close()

    return jsonify(properties)
@app.route("/search_properties", methods=["GET"])
def search_properties():

    city = request.args.get("city", "")
    max_price = request.args.get("price", "")
    bedrooms = request.args.get("bedrooms", "")

    db = get_db_connection()
    cursor = db.cursor(dictionary=True)

    query = """
    SELECT *
    FROM properties
    WHERE city LIKE %s
    """

    values = [f"%{city}%"]

    if max_price:
        query += " AND price <= %s"
        values.append(max_price)

    if bedrooms:
        query += " AND bedrooms = %s"
        values.append(bedrooms)

    cursor.execute(query, tuple(values))

    properties = cursor.fetchall()

    cursor.close()
    db.close()

    return jsonify(properties)
@app.route("/property/<int:id>", methods=["GET"])
def get_property(id):

    db = get_db_connection()
    cursor = db.cursor(dictionary=True)

    cursor.execute(
        "SELECT * FROM properties WHERE id=%s",
        (id,)
    )

    property = cursor.fetchone()

    cursor.close()
    db.close()

    return jsonify(property)
@app.route("/admin/properties", methods=["GET"])
def admin_properties():

    db = get_db_connection()
    cursor = db.cursor(dictionary=True)

    cursor.execute("SELECT * FROM properties")

    properties = cursor.fetchall()

    cursor.close()
    db.close()

    return jsonify(properties)
@app.route("/delete_property/<int:id>", methods=["DELETE"])
def delete_property(id):

    try:

        db = get_db_connection()
        cursor = db.cursor()

        cursor.execute(
            "DELETE FROM properties WHERE id=%s",
            (id,)
        )

        db.commit()

        cursor.close()
        db.close()

        return jsonify({
            "message": "Property Deleted Successfully"
        })

    except Exception as e:

        return jsonify({
            "message": str(e)
        }), 500
@app.route("/property_edit/<int:id>", methods=["GET"])
def property_edit(id):

    db = get_db_connection()
    cursor = db.cursor(dictionary=True)

    cursor.execute(
        "SELECT * FROM properties WHERE id=%s",
        (id,)
    )

    property = cursor.fetchone()

    cursor.close()
    db.close()

    return jsonify(property)
@app.route("/update_property/<int:id>", methods=["PUT"])
def update_property(id):

    data = request.json

    db = get_db_connection()
    cursor = db.cursor()

    cursor.execute("""
    UPDATE properties
    SET property_name=%s,
        city=%s,
        area=%s,
        price=%s,
        bedrooms=%s,
        bathrooms=%s,
        sqft=%s,
        image=%s,
        description=%s
    WHERE id=%s
    """, (

        data["property_name"],
        data["city"],
        data["area"],
        data["price"],
        data["bedrooms"],
        data["bathrooms"],
        data["sqft"],
        data["image"],
        data["description"],
        id

    ))

    db.commit()

    cursor.close()
    db.close()

    return jsonify({
        "message": "Property Updated Successfully"
    })
@app.route("/predict_price", methods=["POST"])
def predict_price():

    data = request.json

    input_data = pd.DataFrame([{
        "city": data["city"],
        "bedrooms": int(data["bedrooms"]),
        "bathrooms": int(data["bathrooms"]),
        "sqft": int(data["sqft"])
    }])

    prediction = model.predict(input_data)[0]

    return jsonify({
        "predicted_price": round(float(prediction), 2)
    })
@app.route("/wishlist", methods=["POST"])
def add_to_wishlist():

    data = request.json

    db = get_db_connection()
    cursor = db.cursor(dictionary=True)

    cursor.execute(
        "SELECT * FROM wishlist WHERE user_id=%s AND property_id=%s",
        (data["user_id"], data["property_id"])
    )

    existing = cursor.fetchone()

    if existing:
        cursor.close()
        db.close()

        return jsonify({
            "message": "Property already saved."
        })

    cursor = db.cursor()

    cursor.execute(
        "INSERT INTO wishlist(user_id, property_id) VALUES(%s,%s)",
        (data["user_id"], data["property_id"])
    )

    db.commit()

    cursor.close()
    db.close()

    return jsonify({
        "message": "Property Saved Successfully ❤️"
    })
@app.route("/wishlist/<int:user_id>", methods=["GET"])
def get_wishlist(user_id):

    db = get_db_connection()
    cursor = db.cursor(dictionary=True)

    query = """
    SELECT properties.*
    FROM wishlist
    JOIN properties
    ON wishlist.property_id = properties.id
    WHERE wishlist.user_id=%s
    """

    cursor.execute(query, (user_id,))

    properties = cursor.fetchall()

    cursor.close()
    db.close()

    return jsonify(properties)
@app.route("/analytics", methods=["GET"])
def analytics():

    db = get_db_connection()
    cursor = db.cursor(dictionary=True)

    cursor.execute("SELECT COUNT(*) AS total_users FROM users")
    users = cursor.fetchone()["total_users"]

    cursor.execute("SELECT COUNT(*) AS total_properties FROM properties")
    properties = cursor.fetchone()["total_properties"]

    cursor.execute("SELECT COUNT(*) AS total_wishlist FROM wishlist")
    wishlist = cursor.fetchone()["total_wishlist"]

    cursor.execute("SELECT AVG(price) AS average_price FROM properties")
    avg_price = cursor.fetchone()["average_price"]

    cursor.close()
    db.close()

    return jsonify({
        "users": users,
        "properties": properties,
        "wishlist": wishlist,
        "average_price": round(avg_price or 0, 2)
    })
@app.route("/analytics_chart")
def analytics_chart():

    db = get_db_connection()
    cursor = db.cursor(dictionary=True)

    cursor.execute("""
        SELECT city, COUNT(*) AS total
        FROM properties
        GROUP BY city
    """)

    city_data = cursor.fetchall()

    cursor.close()
    db.close()

    return jsonify(city_data)




@app.route("/uploads/<filename>")
def uploaded_file(filename):
    return send_from_directory(
        app.config["UPLOAD_FOLDER"],
        filename
    )


@app.route("/pages/<path:filename>")
def pages(filename):
    return send_from_directory("../frontend/pages", filename)


@app.route("/css/<path:filename>")
def css(filename):
    return send_from_directory("../frontend/css", filename)


@app.route("/js/<path:filename>")
def js(filename):
    return send_from_directory("../frontend/js", filename)


@app.route("/images/<path:filename>")
def images(filename):
    return send_from_directory("../frontend/images", filename)

if __name__ == "__main__":
    app.run(debug=True)