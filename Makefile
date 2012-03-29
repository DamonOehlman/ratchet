SHELL := /bin/bash

build:
	@interleave src/ratchet.js --package

test:
	@mocha --reporter spec

.PHONY: test