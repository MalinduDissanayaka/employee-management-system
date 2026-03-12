import urllib.request, urllib.parse, json, urllib.error

base = 'http://localhost:8000'

def post_json(path, data):
    body = json.dumps(data).encode()
    req = urllib.request.Request(base+path, data=body, headers={'Content-Type':'application/json'}, method='POST')
    try:
        with urllib.request.urlopen(req, timeout=5) as r:
            content = r.read()
            return r.status, json.loads(content) if content else {}
    except urllib.error.HTTPError as e:
        content = e.read()
        try:
            return e.code, json.loads(content) if content else {}
        except Exception:
            return e.code, {'raw': content.decode(errors='replace')}

def post_form(path, data):
    body = urllib.parse.urlencode(data).encode()
    req = urllib.request.Request(base+path, data=body, headers={'Content-Type':'application/x-www-form-urlencoded'}, method='POST')
    try:
        with urllib.request.urlopen(req, timeout=5) as r:
            content = r.read()
            return r.status, json.loads(content) if content else {}
    except urllib.error.HTTPError as e:
        content = e.read()
        try:
            return e.code, json.loads(content) if content else {}
        except Exception:
            return e.code, {'raw': content.decode(errors='replace')}

def get_auth(path, token):
    req = urllib.request.Request(base+path, headers={'Authorization': 'Bearer '+token})
    try:
        with urllib.request.urlopen(req, timeout=5) as r:
            content = r.read()
            return r.status, json.loads(content) if content else {}
    except urllib.error.HTTPError as e:
        content = e.read()
        try:
            return e.code, json.loads(content) if content else {}
        except Exception:
            return e.code, {'raw': content.decode(errors='replace')}

import time
TEST_EMAIL = f'apitest_{int(time.time())}@test.com'
print(f'  Using email: {TEST_EMAIL}')
s, d = post_json('/register', {'email': TEST_EMAIL, 'password': 'pass1234'})
print(f'  Status: {s}  Body: {d}')
ok = s == 200
print(f'  PASS' if ok else '  FAIL - expected 200')

print()
print('=== 2. REGISTER DUPLICATE (should be 400) ===')
s, d = post_json('/register', {'email': TEST_EMAIL, 'password': 'pass1234'})
print(f'  Status: {s}  Body: {d}')
ok = s == 400
print(f'  PASS' if ok else '  FAIL - expected 400')

print()
print('=== 3. LOGIN correct credentials (should be 200 with token) ===')
s, d = post_form('/login', {'username': TEST_EMAIL, 'password': 'pass1234'})
print(f'  Status: {s}  Body: {d}')
token = d.get('access_token', '')
ok = s == 200 and token != ''
print(f'  PASS - token received' if ok else '  FAIL - expected 200 with access_token')

print()
print('=== 4. LOGIN wrong password (should be 401) ===')
s, d = post_form('/login', {'username': TEST_EMAIL, 'password': 'wrongpass'})
print(f'  Status: {s}  Body: {d}')
ok = s == 401
print(f'  PASS' if ok else '  FAIL - expected 401')

print()
print('=== 5. GET /employees/ WITH valid token (should be 200) ===')
s, d = get_auth('/employees/', token)
print(f'  Status: {s}  Body type: {type(d).__name__}  Items: {len(d) if isinstance(d, list) else d}')
ok = s == 200
print(f'  PASS' if ok else '  FAIL - expected 200')

print()
print('=== 6. GET /employees/ WITHOUT token (should be 401) ===')
req = urllib.request.Request(base+'/employees/')
try:
    with urllib.request.urlopen(req, timeout=5) as r:
        print(f'  Status: {r.status}  FAIL - expected 401 but got 200')
except urllib.error.HTTPError as e:
    content = e.read()
    body = json.loads(content) if content else {}
    print(f'  Status: {e.code}  Body: {body}')
    ok = e.code == 401
    print(f'  PASS' if ok else '  FAIL - expected 401')

print()
print('=== 7. POST /employees/ CREATE employee ===')
emp_data = {'name': 'John Doe', 'email': 'john@company.com', 'department': 'Engineering', 'position': 'Developer', 'salary': 75000}
s, d = post_json('/employees/', {'name': 'John Doe', 'email': 'john@company.com', 'department': 'Engineering', 'position': 'Developer', 'salary': 75000})
# Need to send with auth token
body = json.dumps(emp_data).encode()
req = urllib.request.Request(base+'/employees/', data=body, headers={'Content-Type':'application/json', 'Authorization': 'Bearer '+token}, method='POST')
try:
    with urllib.request.urlopen(req, timeout=5) as r:
        content = r.read()
        d = json.loads(content)
        print(f'  Status: {r.status}  Body: {d}')
        print('  PASS' if r.status == 200 else '  FAIL')
except urllib.error.HTTPError as e:
    content = e.read()
    print(f'  Status: {e.code}  Body: {json.loads(content) if content else {}}')
    print('  FAIL')

print()
print('==============================')
print('ALL API TESTS COMPLETE')
