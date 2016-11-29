const schema = module.exports = {
	all : {
		path: '/',
		method : 'get',
		result : {
			type : 'array',
			items : {
				type : 'object',
				properties : {
					id : {type : 'string'},
					username : {type : 'string'}
				},
				required : ['id', 'username']
			}
		}
	},
	create : {
		path: '/',
		method : 'post',
		body : {
	        type:'object',
	        properties : {
	            username: {type : 'string'},
	            passwd: {type: 'string'}
	        },
	        required : ['username','passwd']
    		},
    		result : {
    			type: 'object',
    			properties : {
		            username: {type : 'string'}
		      },
		      required : ['username']
    		}
	},
	update : {
		path: '/:id',
		method : 'put',
		params : {
			type: 'object',
			properties : {
				id:{type : 'string'}
			},
			required: ['id']
		},
		body : {
			type: 'object',
			properties : {
				passwd : {type: 'string'}
			},
			required: ['passwd']
		},
		result : {
    			type: 'object',
    			properties : {
		            username: {type : 'string'}
		      },
		      required : ['username']
    		}
	}
};