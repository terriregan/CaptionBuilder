Ext.define("CB.Constants", {
	singleton : true,

    // layout
    CARD_PROJECT_LIST : 0,
    CARD_FINAL_OBJECT_LIST : 1,
    CARD_CAPTION : 2,

    // button actions
    ACTION_GO_CB_HOME : '/',
    ACTION_GO_BLOOM_HOME : 4,
    ACTION_HELP : 5,
    ACTION_SUPPORT : 6,

    // events
    EVENT_RDF: 'rdf',
    EVENT_RDF_PARSED: 'rdfParsed',
    EVENT_RDF_ERROR: 'rdfError',
    EVENT_CAPTION: 'caption',
    EVENT_CAPTION_CLEAR: 'captionClear',
    EVENT_CAPTION_CREATE: 'captionCreate',
    EVENT_HASH: 'hash',
    EVENT_TIME_IN: 'timeIn',
    EVENT_TIME_OUT: 'timeOut',

    // messages
	SYSTEM_GENERIC_ERROR_MSG : 'Unknown error.',
	SAVE_SUCCESS_MSG : 'Your content was successfully saved.',
	SAVE_FAILURE_MSG : 'The system was unable to save your content.',
	CREATE_SUCCESS_MSG : 'Your content was successfully created.',
	CREATE_FAILURE_MSG : 'The system was unable to create your content.',
	LOAD_FAILURE_MSG : 'The system was unable to load your content.',
	EDIT_SELECT_ONE : 'Select an item to continue.',
	EDIT_SELECT_FEWER : 'You may only perform this action on 10 or fewer items',
	EDIT_TOO_MANY : 'You may only perform this action on a single item at a time.'
});
