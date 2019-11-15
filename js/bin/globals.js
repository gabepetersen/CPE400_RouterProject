/*
  globals.js -- one singular location for global variables.

  This file is the ONLY place where global variables should be placed, to help with keeping track of them.

  BY CONVENTION: global variables should be pre-faced with the text GLOB_ to make it clear that the variable
  is a global variable.

  ** Global variables are typically considered a code smell in Javascript because they can get messy quickly,
  so our goal here is to prevent them from becoming a mess. **
 */


// Declare the angular module immediately
var GLOB_cpeAngularApp = angular.module('cpeAngularApp', ['ngRoute']);

var GLOB_topology = null;

var GLOB_selectedRouter = null;