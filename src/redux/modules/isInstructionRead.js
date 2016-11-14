const READ_INSTRUCTION = 'frontend-advisor/isInstructionRead/READ_INSTRUCTION';
const UNREAD_INSTRUCTION = 'frontend-advisor/isInstructionRead/UNREAD_INSTRUCTION';

export default function reducer(state = false, action) {
  switch (action.type) {
    case READ_INSTRUCTION:
      return true;
    case UNREAD_INSTRUCTION:
      return false;
    default:
      return state;
  }
}

export function readInstruction() {
  localStorage.setItem('isInstructionRead', true);
  return {
    type: READ_INSTRUCTION
  };
}

export function unReadInstruction() {
  localStorage.setItem('isInstructionRead', false);
  return {
    type: UNREAD_INSTRUCTION
  };
}

export function initialize() {
  if (localStorage.getItem('isInstructionRead') === 'true') {
    return readInstruction();
  }
  return unReadInstruction();
}
