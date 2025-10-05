 
### 💳 What the Project Is About:

 **detect fake or suspicious bank transactions automatically** using **data analysis and machine learning**.

It helps banks follow **KYC (Know Your Customer)** and **AML (Anti-Money Laundering)** rules by spotting patterns that look unusual — for example, if someone suddenly transfers a huge amount or makes too many transactions at night.

---

### 🔧 Step-by-Step Explanation:

#### **1. Getting the Data**

You take all the **bank transaction data** (like who sent money, how much, when, and where) from a **PostgreSQL database** using **SQL**.
You clean it — remove duplicates, fix missing values, and make sure it’s all accurate (98% clean data).

Example data might look like this:

| transaction_id | customer_id | amount | merchant     | location | time     | is_fraud |
| -------------- | ----------- | ------ | ------------ | -------- | -------- | -------- |
| 1001           | C001        | 2500   | Flipkart     | Delhi    | 10:30 AM | 0        |
| 1002           | C002        | 90000  | UnknownStore | Russia   | 3:00 AM  | 1        |

---

#### **2. Preparing the Data**

You create **extra features** (useful columns) that help detect fraud, like:

* How often a person spends money
* Average amount per day
* Time gap between transactions
* High-risk merchants or locations

Then you make sure all numbers are on the same scale (normalization).

---

#### **3. Detecting Fraud with Machine Learning**

You use **Python and Scikit-learn** to train a **machine learning model** (like Random Forest or Isolation Forest).
This model learns what *normal transactions* look like and what *fraudulent ones* look like.

Once trained, the model can look at new transactions and say:
✅ “This looks normal”
❌ “This looks suspicious — maybe fraud”

Your model correctly identifies about **90% of fraud cases**.

---

#### **4. Showing the Results Visually**

You use **Plotly** to create beautiful, interactive **dashboards** — like charts and graphs — that show:

* Total fraud vs. normal transactions
* Which merchants or locations have the most fraud
* Trends of fraud over time

This helps **bank analysts** easily see where problems are happening.

---

#### **5. Automating the Process**

You make the system **run automatically every day** — so when new transactions come in, it:

1. Cleans the data
2. Runs the fraud detection model
3. Updates the dashboard
4. Alerts if anything suspicious is found

This saves analysts a lot of manual work.

---

### 🧠 In Short:

You built a system that:

* Reads and cleans bank transaction data
* Learns what fraud looks like
* Automatically detects suspicious transactions
* Shows live results on a dashboard

It’s like a **smart fraud-detecting assistant for banks** 🔍💰

 

<img width="146" height="436" alt="image" src="https://github.com/user-attachments/assets/a235fd83-0149-4703-97c6-9663d6031f6b" />


## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`
