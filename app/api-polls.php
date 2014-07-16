<?php

class API {

	private $action;
	private $request;
	private $response_body;

	private $data;
	private $data_path;
	private $collection;
	private $max_id_used;

	private $data_changed;
	
	const OK = 200;
	const ERROR = 500;
	const NOT_FOUND = 404;
	const NOT_ALLOWED = 405;
	const BAD_REQUEST = 400;

	public function __construct() 
	{
		$this->data_changed = false;

		$this->response_body = array();

		$this->data_path = dirname(__FILE__) . '/json/polls.json';

		$this->setServerAction();

		$this->loadCollectionData();

		$this->loadAndSanitizeRequestData();
	}

	public function processRequest()
	{
		if ($this->setIp()) {
			$this->_processRequest();
		} else {
			$this->setResponseStatus(self::BAD_REQUEST);

			$this->sendResponse();
		}
	}

	private function _processRequest() 
	{
		switch($this->action) {
			case 'GET':
				if ($this->requestHasRequiredAttributes(array('id'))) {
					$this->handleRequest__GET_model();	
				} else {
					$this->handleRequest__GET_collection();	
				}

				break;

			case 'POST':
				if ($this->requestHasRequiredAttributes()) {
					$this->handleRequest__POST();
				} else {
					$this->setResponseStatus(self::BAD_REQUEST);
				}

				break;

			case 'PUT':
				if ($this->requestHasRequiredAttributes(array('id'))) {
					$this->handleRequest__PUT();
				} else {
					$this->setResponseStatus(self::BAD_REQUEST);
				}

				break;

			case 'DELETE':
				if ($this->requestHasRequiredAttributes(array('id'))) {
					$this->handleRequest__DELETE();
				} else {
					$this->setResponseStatus(self::BAD_REQUEST);
				}

				break;

			case 'VOTE':
				if ($this->requestHasRequiredAttributes(array('id', 'choiceId'))) {
					$this->handleRequest__VOTE();	
				} else {
					$this->setResponseStatus(self::BAD_REQUEST);
				}

				break;

			default:
				$this->setResponseStatus(self::NOT_ALLOWED);

				break;
		}

		$this->saveCollectionDataIfChanged();

		$this->sendResponse();
	}

	private function setResponseStatus($code = 200) 
	{
	    $status = array(  
	        200 => 'OK',
	        400 => 'Bad Request',
	        404 => 'Not Found', 
	        405 => 'Method Not Allowed',  
	        500 => 'Internal Server Error'
	    ); 

	    $this->code = $code;
	    $this->message = $status[$this->code];
	}

	private function setIp() 
	{
		if (isset($_GET['ip'])) {
			$this->ip = $_GET['ip'];

			unset($_GET['ip']);

			return true;
		} 

		return false;
	}

	private function setServerAction() 
	{
		if (isset($_GET['action'])) {
			$this->action = strtoupper($_GET['action']);

			unset($_GET['action']);
		} else {
			$this->action = $_SERVER['REQUEST_METHOD'];
		}
	}

	private function loadAndSanitizeRequestData() 
	{
		if ($this->action == 'VOTE') {
			$request_data = $_GET;
		} elseif ($this->action == 'GET') {
			$request_data = $_GET;
		} elseif ($this->action == 'POST' && count($_POST)) {
			$request_data = $_POST;
		} else {
			$request_data = json_decode(file_get_contents("php://input"), true);
		}

		if (is_array($request_data)) {
			$sanitized_request_data = array();

			foreach ($request_data as $key => $value) {
	            $sanitized_request_data[$key] = trim(strip_tags($value));
	        }

	        $request_data = $sanitized_request_data;
	    }

		$this->request = $request_data;
	}

	private function loadCollectionData() 
	{
		$this->data = json_decode(file_get_contents($this->data_path), true);

		$this->max_id_used = $this->data['max_id_used'];

		$this->collection = $this->data['collection'];
	}

	private function saveCollectionDataIfChanged() 
	{
		if ($this->data_changed) {
			$this->data['max_id_used'] = $this->max_id_used;
			
			$this->data['collection'] = $this->collection;

			file_put_contents($this->data_path, json_encode($this->data));
		}
	}

	private function sendResponse()
	{
		header("Content-Type: application/json");
        header("HTTP/1.1 " . $this->code . " " . $this->message);


        print json_encode($this->response_body);
        exit;
	}

	private function requestHasRequiredAttributes($required_keys = array()) 
	{
		foreach ($required_keys as $key) {
			if (!isset($this->request[$key])) {
				return false;
			}
		}

		return true;
	}

	private function createAndReturnFormattedModel() 
	{
		$this->max_id_used += 1;

		$this->collection[] = array_merge(
			$this->request, 
			array('id' => $this->max_id_used)
		);

		$this->data_changed = true;

		return $this->formatModelAttributesForReturn($this->collection[$max_id_used]);
	}

	private function updateModel($index) 
	{
		$model = $this->collection[$index];

        $this->collection[$index] = array_merge($model, $this->request);

		$this->data_changed = true;
	}

	private function deleteModel($index) 
	{
		unset($this->collection[$index]);

		$this->data_changed = true;
	}

	private function formatModelAttributesForReturn($model) 
	{	
		$voted = false;
		$closed = time() >= $model['endDate'];

		foreach ($model['results'] as $result) {
			if (in_array($this->ip, $result['votes'])) {
				$voted = true;
				
				break;
			}
		}

		if ($voted || $closed) {
			foreach ($model['results'] as &$result) {
				$result['votedFor'] = in_array($this->ip, $result['votes']);

				$result['votes'] = count($result['votes']);
			}	
		} else {
			$model['results'] = array();
		}

		return $model;
	}

	private function castVote($index) 
	{
		$can_vote 	= true;
		$model 		= $this->collection[$index];

		foreach ($model['results'] as $result) {
			if (in_array($this->ip, $result['votes'])) {
				$can_vote = false;
				
				break;
			}
		}

		if ($can_vote) {
			foreach ($model['results'] as &$result) {
				if ($result['choiceId'] == $this->request['choiceId']) {
					$result['votes'][] = $this->ip;
				}
			}

			$this->collection[$index] = $model;

			$this->data_changed = true;
		}

		return array(
			'success' => $can_vote
		);
	}

	private function findModelIndexByID($id) 
	{
		foreach($this->collection as $index => $model) {
			if($model['id'] == $id) {
				return $index;
			}
		}

		return -1;
	}

	////////////////////
	// CRUD Endpoints //
	////////////////////

	private function handleRequest__GET_collection()
	{
		$this->setResponseStatus(self::OK);

		$filtered_collection = array_map(function ($model) {
			foreach (array('description', 'choices', 'results') as $attribute) {
				unset($model[$attribute]);
			}

			return $model;
		}, $this->collection);

        $this->response_body = $filtered_collection;
	} 

	private function handleRequest__GET_model() 
	{
		$index = $this->findModelIndexByID($this->request['id']);

	    if ($index >= 0) {
	    	$this->setResponseStatus(self::OK);

	    	$this->response_body = $this->formatModelAttributesForReturn($this->collection[$index]);
	    } else {
	    	$this->setResponseStatus(self::NOT_FOUND);
	    }
	}

	private function handleRequest__POST() 
	{
		$this->setResponseStatus(self::OK);

		$this->response_body = $this->createAndReturnFormattedModel();
	}

	private function handleRequest__PUT() 
	{
		$index = $this->findModelIndexByID($this->request['id']);

        if ($index >= 0) {
        	$this->setResponseStatus(self::OK);

        	$this->updateModel($index);
        } else {
        	$this->setResponseStatus(self::NOT_FOUND);
        }
	} 

	private function handleRequest__DELETE() 
	{
		$index = $this->findModelIndexByID($this->request['id']);

        if ($index >= 0) {
        	$this->setResponseStatus(self::OK);

			$this->deleteModel($index);        	
        } else {
        	$this->setResponseStatus(self::NOT_FOUND);
        }
	}

	/////////////////////
	// Other Endpoints //
	/////////////////////

	private function handleRequest__VOTE()
	{
		$index = $this->findModelIndexByID($this->request['id']);

	    if ($index >= 0) {
	    	$this->setResponseStatus(self::OK);

	    	$this->response_body = $this->castVote($index);
	    } else {
	    	$this->setResponseStatus(self::NOT_FOUND);
	    }
	}
}

$rest_api = new API();

$rest_api->processRequest();
?>