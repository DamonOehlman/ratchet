SHELL := /bin/bash

build:
	@interleave build src/ratchet.js --wrap

test:
	@mocha --reporter spec

.PHONY: test