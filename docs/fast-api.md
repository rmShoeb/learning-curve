# Topic: FastAPI

---

# Installation
```bash
pip3 install fastapi # install FastAPI
pip3 install uvicorn # to run the server
```
---

# Introduction
```python
from fastapi import FastAPI
app = FastAPI()
@app.get("/")
def home():
    return {"name": "Hello World"}
```
- To start the server: `uvicorn api:app --reload`
- This starts the server at `http://127.0.0.1:8000` and `/docs` after any url lets test the functions without any third party tools.
- The `--reload` tells uvicorn to restart the server everytime a change has been made in the code.
- The `/docs` endpoint creates a documentation using `Swagger UI`, and `/redoc` endpoint creates a documentation using `ReDoc`.

---

# Path Parameters
- Parameters are passed at the end of the endpoints.
- Then inside the function parameters, the path parameters are used, with type definitions.
- These type definitions help FastAPI to automatically validate input data.

```python
# single path parameter
@app.get("/get-item/{item_id}")
def get_item(item_id: int):
    return inventory[item_id]

# multiple path parameters
@app.get("/get-item/{item_id}/{name}")
def get_item(item_id: int, name:str):
    return inventory[item_id][name]
```

## Adding details/constraints to path parameters
```python
from fastapi import Path
@app.get("/get-item/{item_id}")
def get_item(item_id: int = Path(None, description="ID of the item")):
    return inventory[item_id]
```
- The first parameter of Path is the default value for the path parameter, if no value is passed for the parameter.

---

# Query Parameters
- In a url of the form `fast.com/home?name=something&msg=message`, `name` and `msg` are query parameters.
- When positioning parameters, mandatory parameters should be defined before the optional parameters (this is according to Python’s definition).
```python
@app.get("/get-item-name")
def get_item(item_id: int):
    try:
        return inventory[item_id]
    except:
        return {"Data": "not found"}

# optional parameters and default values
from typing import Optional
def get_item(item_id: Optional[int] = None):
    ...
```

---

# Request Body
- This is kind of a query parameter, but the parameter is actually an object model.
- When FastAPI sees an object model in the query, instead of showing the parameters in the url as parameters, it is sent as a request body.
```python
from pydantic import BaseModel

class Item(BaseModel):
    name: str
    price: int
    brand: Optional[str] = None

@app.post("/create-item")
def create_item(item: Item):
    ...
```

---

# Returning Status Code
```python
from fastapi import HTTPException, status
...
raise HTTPException(status_code = status.HTTP_404_NOT_FOUND, detail = "message")
```
