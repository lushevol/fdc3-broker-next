## get python 3
- download link
    https://axess.sc.net/marketplace/golden-versions/gv-python-v1
- setup artifact path in .pip if linux or on pip.ini if windows

### create env in linux
- python3 -m venv venv
- source venv/bin/activate
- pip install --upgrade pip
- pip install --upgrade setuptools

### create env in windows
- pip install virtualenv
- python -m virtualenv venv
- .\venv\Scripts\activate.bat
- pip install --upgrade pip
- pip install --upgrade setuptools

### package installation
- pip install -r requirements.txt

### start
python main.py

### test
- using unittest
    - run one
        python -m unittest test_app.py
    - run all
        python -m unittest discover -s test
    - coverage
        coverage run -m unittest discover -s test
        coverage html
- using pytest, looks this only supported by ADO
    - run one
        pytest py_test_app.py
    - run all
        pytest test/
    - coverage
        pytest test/ --junitxml=./coverage/out_report.xml
        coverage run -m pytest test/
        coverage html
- skip coverage
        add next to func def, or condition etc # pragma: no cover

### logging
- refer to https://confluence.global.standardchartered.com/display/RTEC/GF+CATALYST+-+Observability+-+App+Logging+Standardization