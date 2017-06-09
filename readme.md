# [Mask Form](https://www.npmjs.com/package/mask-form)

[![npm version](https://badge.fury.io/js/mask-form.svg)](https://badge.fury.io/js/mask-form) [![Bower version](https://badge.fury.io/bo/mask-form.svg)](https://badge.fury.io/bo/mask-form)

A mask to input[mask] fields;

PS: The Readme document is not up to date.

## Using Mask Form you can:
  - Using default mask rules;
  - Create your own masks;

### Installation
###### Using like a library
```sh
$ git clone https://github.com/rlazarini/mask-form.git
```
```HTML
<body>
...
...
<script src="path/to/mask-form/index.js"></script>
</body>
```

###### Using like a module
```sh
$ npm install mask-form --save
```

### Usage
###### Using like a module
```js
var maskForm = require('mask-form');
maskForm._maskForm(form);
```

#### Examples
###### Basic Usage
```HTML
<body>
	<form action="" id="form" novalidate>
		<input type="text">
		<!-- Mask only fields with mask attribute -->
		<input type="text" mask="mask">
		<input type="cpf" mask>
		<input type="text" data-type="cpf" mask="mask">
		<input type="text" data-type="zipcode" mask="mask">
		<input type="text" data-type="date" data-format="00/00/0000" mask="mask">
		<input type="submit" value="send">
	</form>
	<script>
		var form = document.getElementById('form');
		maskForm._maskForm(form);
	</script>
</body>
```

###### Create your own mask, with type or data-type
```HTML
<body>
	<form action="" id="form" novalidate>
		<input type="text" data-type="myownmask" mask="mask">
		<input type="myowntype" mask="mask">
		<input type="submit" value="send">
	</form>
	<script>
		var form = document.getElementById('form')
		,	obj  = {
			'myownmask': 'AAA/AA-000-0',
			'myowntype': '000.000-A-B-C'
		};
		
		maskForm._maskForm(form, obj);
	</script>
</body>
```

###### Mask a input using attribute data-type
> In this method, the input don't lose your properties. 

> Default Options to data-type

```sh
cpf			## Mask like a Brazil document
cnpj		## Mask like a Brazil company document
cpfcnpj		## Mask like a Brazil document OR company document
phone		## Mask like a Brazilian phone number
zipcode		## Mask like a Brazilian zipcode address
currency	## Mask like a monetary value. By default, using R$ and currency format (R$ 1.000,00), but you can pass a monetary symbol with attribute data-monetary, and another options (see more above)
date		## Mask like a date. Default is 0000/00/00, but you can pass another model.
```
 
> The data-type\[currency\], has 3 another attributes you can use:

```sh
data-monetary			## You can pass a monetary symbol to your mask, by default: R$
data-monetary-imperial	## You can tell whether the value will be written with imperial mode. Ex.: US$ 1,000,000.00
data-monetary-revert	## You can tell whether the value have the monetary symbol in the end. Ex.: 25 ¢
```
 
> The input\[date\] (or data-type[date], if you wish), has 1 another attribute you can use:

```sh
data-format	## Pass the format of your date, by default use international date format (0000/00/00).
```