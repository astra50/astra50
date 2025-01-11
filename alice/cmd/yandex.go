package cmd

type Response struct {
	RequestID string  `json:"request_id"`
	Payload   Payload `json:"payload"`
}

type Payload struct {
	UserID  string   `json:"user_id,omitempty"`
	Devices []Device `json:"devices"`
}

type Device struct {
	ID           string        `json:"id"`
	Name         string        `json:"name,omitempty"`
	Description  string        `json:"description"`
	Room         string        `json:"room,omitempty"`
	Type         string        `json:"type,omitempty"`
	Capabilities []Capability  `json:"capabilities,omitempty"`
	ActionResult *ActionResult `json:"action_result,omitempty"`
}

type Capability struct {
	Type        string            `json:"type"`
	State       *State            `json:"state,omitempty"`
	Retrievable bool              `json:"retrievable"`
	Parameters  map[string]string `json:"parameters,omitempty"`
}

type ActionResult struct {
	Status       string `json:"status"`
	ErrorCode    string `json:"error_code,omitempty"`
	ErrorMessage string `json:"error_message,omitempty"`
}

type State struct {
	Instance     string       `json:"instance"`
	Value        bool         `json:"value,omitempty"`
	ActionResult ActionResult `json:"action_result,omitempty"`
}
