// Import Tinytest from the tinytest Meteor package.
import { Tinytest } from "meteor/tinytest";

// Import and rename a variable exported by maps.js.
import { name as packageName } from "meteor/maps";

// Write your tests here!
// Here is an example.
Tinytest.add('maps - example', function (test) {
  test.equal(packageName, "maps");
});
