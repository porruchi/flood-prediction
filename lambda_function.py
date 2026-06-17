import os
import boto3
import zipfile
import sys

s3 = boto3.client('s3')
bucket_name = 'flood-predict'

def lambda_handler(event, context):
    try:
        # 1. ดาวน์โหลด dependencies.zip
        dependencies_key = 'dependencies.zip'
        dependencies_path = '/tmp/dependencies.zip'
        s3.download_file(bucket_name, dependencies_key, dependencies_path)

        # 2. แตกไฟล์ไปที่ /tmp
        with zipfile.ZipFile(dependencies_path, 'r') as zip_ref:
            zip_ref.extractall('/tmp')

        # ตรวจสอบไฟล์ใน /tmp
        print("Contents of joblib:", os.listdir('/tmp/joblib'))

        # 3. เพิ่ม /tmp ใน sys.path
        sys.path.insert(0, '/tmp')

        # Debug: ตรวจสอบไฟล์ใน /tmp
        print("Files in /tmp:", os.listdir('/tmp'))

        # 4. นำเข้าไลบรารี
        import joblib
        import pandas as pd

        # 5. ดาวน์โหลดโมเดล
        model_key = 'flood_risk_model.pkl'
        model_path = '/tmp/flood_risk_model.pkl'
        s3.download_file(bucket_name, model_key, model_path)

        # 6. โหลดโมเดล
        model = joblib.load(model_path)
        print("Model loaded successfully")

        # 7. รับข้อมูล input จาก event
        input_data = event.get('data', {})
        if not input_data:
            return {
                'statusCode': 400,
                'message': 'No data provided'
            }

        # 8. แปลงข้อมูล input เป็น DataFrame
        df = pd.DataFrame([input_data])
        features = ['frd_total_rainfall', 'Temperature', 'Humidity', 'Wind Speed']
        if not all(f in df.columns for f in features):
            missing = [f for f in features if f not in df.columns]
            return {
                'statusCode': 400,
                'message': f'Missing features: {missing}'
            }

        # 9. ทำการพยากรณ์
        X_new = df[features]
        prediction = model.predict(X_new)[0]

        return {
            'statusCode': 200,
            'prediction': prediction
        }

    except Exception as e:
        # พิมพ์ข้อผิดพลาดสำหรับ debugging
        print("Error:", str(e))
        return {
            'statusCode': 500,
            'message': f'Error occurred: {str(e)}'
        }
