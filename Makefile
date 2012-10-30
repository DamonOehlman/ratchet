SHELL := /bin/bash

build:
	@interleave build src/ratchet.js --output ./

test:
	@mocha --reporter spec

.PHONY: test