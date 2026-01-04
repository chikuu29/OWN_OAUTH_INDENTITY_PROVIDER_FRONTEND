import json

# Sample apps data based on API response
APPS_JSON = """
[
    {
        "code": "APP_0c4854",
        "name": "Test Application",
        "base_price": "3999.00",
        "features": [
            {
                "code": "FEAT_AUTH",
                "name": "Authentication",
                "is_base_feature": true,
                "addon_price": "0.00"
            },
            {
                "code": "FEAT_STORAGE",
                "name": "Storage",
                "is_base_feature": false,
                "addon_price": "10.00"
            }
        ]
    }
]
"""

def calculate_app_price(app_data, selected_feature_codes):
    base_price = float(app_data['base_price'])
    addons_price = 0
    
    for feature in app_data.get('features', []):
        if not feature['is_base_feature'] and feature['code'] in selected_feature_codes:
            addons_price += float(feature['addon_price'])
            
    return base_price + addons_price

def test_pricing_logic():
    apps = json.loads(APPS_JSON)
    app = apps[0]
    
    # Case 1: Only base features
    price1 = calculate_app_price(app, ["FEAT_AUTH"])
    print(f"Price (Base only): {price1}")
    assert price1 == 3999.00
    
    # Case 2: With addon feature
    price2 = calculate_app_price(app, ["FEAT_AUTH", "FEAT_STORAGE"])
    print(f"Price (With Storage): {price2}")
    assert price2 == 4009.00
    
    print("All tests passed!")

if __name__ == "__main__":
    test_pricing_logic()
