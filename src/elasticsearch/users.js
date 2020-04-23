
const users = {
	"properties": {
		"id": {
			"type": "integer"
		},
		"firstName": {
			"type": "text"
		},
		"lastName": {
			"type": "text"
		},
		"email": {
			"type": "text"
		},
		"phone": {
			"type": "text"
		},
		"isAdmin": {
			"type": "boolean"
		},
		"isLocked": {
			"type": "boolean"
		},
		"isDeleted": {
			"type": "boolean"
		},
		"createdAt": {
			"type": "date",
			"format": "yyyy-MM-dd HH:mm:ss||yyyy-MM-dd'T'HH:mm:ss.SSS'Z'||yyyy-MM-dd||epoch_second"
		},
		"updatedAt": {
			"type": "date",
			"format": "yyyy-MM-dd HH:mm:ss||yyyy-MM-dd'T'HH:mm:ss.SSS'Z'||yyyy-MM-dd||epoch_second"
		}
	}
};

module.exports = {users};
