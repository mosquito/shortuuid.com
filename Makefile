vendor-js:
	python3 compile.py \
	    -O js/vendor.min.js \
	    -M js/vendor.min.js.map \
	    https://unpkg.com/bootstrap@3.3.7/dist/js/bootstrap.js \
		https://unpkg.com/jquery@3.6.0/dist/jquery.js
