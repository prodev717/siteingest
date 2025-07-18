from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import requests
import zipfile
import os
import shutil
from bs4 import BeautifulSoup
from dotenv import load_dotenv

load_dotenv()
POCKETBASE_URL = os.getenv("POCKETBASE_URL")

app = Flask(__name__)
CORS(app)

def impressions(siteid):
    COLLECTION = "impressions"
    try:
        res = requests.get(
            f"{POCKETBASE_URL}/api/collections/{COLLECTION}/records",
            params={"filter": f"siteid='{siteid}'"}
        )
        data = res.json()
        if data.get("items"):
            record = data["items"][0]
            record_id = record["id"]
            new_count = record["count"] + 1
            requests.patch(
                f"{POCKETBASE_URL}/api/collections/{COLLECTION}/records/{record_id}",
                json={"count": new_count}
            )
        else:
            requests.post(
                f"{POCKETBASE_URL}/api/collections/{COLLECTION}/records",
                json={"siteid": siteid, "count": 1}
            )
    except Exception as e:
        print("Error tracking impression:", e)

@app.route('/')
def index():
    siteid = request.host.split(".")[0]
    path = f"sites/{siteid}"
    if os.path.exists(os.path.join(path,"index.html")):
        impressions(siteid)
        return send_from_directory(path,"index.html")
    return "Site not found", 404

@app.route('/<path:filename>')
def serve_static(filename):
    siteid = request.host.split(".")[0]
    sitepath = f"sites/{siteid}"
    if os.path.exists(os.path.join(sitepath, filename)):
        return send_from_directory(sitepath, filename)
    else:
        return send_from_directory(sitepath, "index.html")
    
@app.route("/ads/ad.js")
def serve_ad_js():
    return send_from_directory("ads", "ad.js", mimetype="application/javascript")

@app.route("/deploy", methods=["POST"])
def deploy():
    try:
        token = request.form["token"]
        siteid = request.form["siteid"]
        headers = {"Authorization": f"Bearer {token}"}
        url = POCKETBASE_URL+"/api/collections/users/auth-refresh"
        response = requests.post(url, headers=headers)
        if response.status_code != 200:
            return jsonify({"error" : "Invalid Token"}), 400
        file = request.files["file"]
        zipfile_object = zipfile.ZipFile(file.stream)
        output_dir = f"sites/{siteid}/"
        os.makedirs(output_dir, exist_ok=True)
        zipfile_object.extractall(path=output_dir)
        with open(os.path.join(output_dir,"index.html"), "r", encoding="utf-8") as f:
            soup = BeautifulSoup(f, "html.parser")
        script_tag = soup.new_tag("script", src="/ads/ad.js")
        script_tag['data-siteid'] = siteid
        soup.body.append(script_tag)
        with open(os.path.join(output_dir,"index.html"), "w", encoding="utf-8") as f:
            f.write(str(soup))
        return jsonify({"success" : f"{siteid} deployed successfully"}), 200
    except Exception as e:
        return jsonify({"error":str(e)}), 400

@app.route("/delete", methods=["POST"])
def delete():
    try:
        token = request.form["token"]
        siteid = request.form["siteid"]
        headers = {"Authorization": f"Bearer {token}"}
        url = POCKETBASE_URL+"/api/collections/users/auth-refresh"
        response = requests.post(url, headers=headers)
        if response.status_code != 200:
            return jsonify({"error" : "Invalid Token"}), 400
        userid = response.json()["record"]["id"]
        listurl = f'''{POCKETBASE_URL}/api/collections/sites/records?filter=(owner="{userid}")&fields=siteid'''
        lis = requests.get(listurl).json()["items"]
        plist = [item["siteid"] for item in lis]
        if siteid not in plist:
            return jsonify({"error" : "unauthorised access"}), 400
        path = os.path.join("sites",siteid)
        if os.path.exists(path):
            shutil.rmtree(path)
        else:
            return jsonify({"error" : "site dosent exists"}), 400
        return jsonify({"success" : f"{siteid} deleted successfully"}), 200
    except Exception as e:
        return jsonify({"error":str(e)}), 400

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=8000)
    