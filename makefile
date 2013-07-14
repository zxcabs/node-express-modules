MOCHA = ./node_modules/.bin/mocha

test:
	@NODE_ENV=test $(MOCHA)\
			-r should \
			-R spec

test-controllers:
	@NODE_ENV=test $(MOCHA) test/controllers.js\
			-r should \
			-R spec


.PHONY: test test-controllers