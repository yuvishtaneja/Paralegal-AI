import google.generativeai as genai

# Load the API key from keys.txt
with open('keys.txt') as f:
    exec(f.read())

# Configure the API
genai.configure(api_key=GOOGLE_API_KEY)

# Create a model instance
model = genai.GenerativeModel(model_name="gemini-1.5-flash")

# Test prompt
test_prompt = "Hello, how are you?"

try:
    response = model.generate_content(test_prompt)
    print("Prompt sent to Gemini:", test_prompt)
    print("Gemini response:", response.text)
except Exception as e:
    print("Gemini API error:", e)
