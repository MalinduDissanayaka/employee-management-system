from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from jose import JWTError, jwt
from . import models, schemas, crud, database, auth

models.Base.metadata.create_all(bind=database.engine)

app = FastAPI(title="Employee Management System")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

# ==================== GET CURRENT USER (PROTECTION) ====================
def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(database.get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, auth.SECRET_KEY, algorithms=[auth.ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    user = auth.get_user(db, email=email)
    if user is None:
        raise credentials_exception
    return user

# ==================== REGISTER ====================
@app.post("/register", response_model=schemas.User)
def register_user(user: schemas.UserCreate, db: Session = Depends(database.get_db)):
    db_user = auth.get_user(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    return auth.create_user(db=db, user=user)

# ==================== LOGIN ====================
@app.post("/login", response_model=schemas.Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(database.get_db)):
    user = auth.get_user(db, email=form_data.username)
    if not user or not auth.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = auth.create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}

# ==================== PROTECTED EMPLOYEE ROUTES (UPDATED) ====================
@app.get("/employees/")
def read_employees(
    skip: int = 0, 
    limit: int = 100, 
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(get_current_user)   # ← ONLY LOGGED IN CAN SEE
):
    return crud.get_employees(db, skip=skip, limit=limit)

@app.post("/employees/", response_model=schemas.Employee)
def create_employee(
    employee: schemas.EmployeeCreate, 
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(get_current_user)
):
    return crud.create_employee(db=db, employee=employee)

@app.put("/employees/{employee_id}", response_model=schemas.Employee)
def update_employee(
    employee_id: int, 
    employee: schemas.EmployeeUpdate, 
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(get_current_user)
):
    db_employee = crud.update_employee(db, employee_id=employee_id, employee=employee)
    if db_employee is None:
        raise HTTPException(status_code=404, detail="Employee not found")
    return db_employee

@app.delete("/employees/{employee_id}")
def delete_employee(
    employee_id: int, 
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(get_current_user)
):
    db_employee = crud.delete_employee(db, employee_id=employee_id)
    if db_employee is None:
        raise HTTPException(status_code=404, detail="Employee not found")
    return {"message": "Employee deleted successfully"}