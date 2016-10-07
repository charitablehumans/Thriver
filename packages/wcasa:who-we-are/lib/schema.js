/**
 * @summary People Namespace
 * @namespace
 */
Thriver.people = {};

/**
 * @summary People Collection
 * @type {Mongo.Collection}
 */
Thriver.people.collection = new Mongo.Collection('people');

/**
 * @summary People Schema
 * @type {SimpleSchema}
 */
Thriver.people.schema = new SimpleSchema({
    /** ID */
    _id: {
        type: String,
        optional: true // ID is autogenerated
    },
    /** Person's name and credentials */
    name: {
        type: String,
        optional: false,
        label: 'Name and Credentials'
    },
    /** Person's job title */
    title: {
        type: String,
        optional: false,
        label: 'Job or Position Title'
    },
    /** Email address */
    email: {
        type: String,
        optional: false,
        regEx: SimpleSchema.RegEx.Email
    },
    /** Is this person a board member? */
    boardMember: {
        type: Boolean,
        optional: false,
        defaultValue: false,
        label: 'Is this person a Board Member?',
        autoform: {
            type: 'boolean-select'
        }
    },
    /** Picture or Avatar */
    // TODO:  Could this be a Binary Blob at some point?
    picture: {
        type: String,
        optional: true,
        //regEx: /^data:image\/\D+?;base64,[a-z0-9+=/]+/i,
        label: 'Picture or Avatar',
        autoform: {
            type: 'file'
        }
    }
});

/** Attach schema */
Thriver.people.collection.attachSchema(Thriver.people.schema);