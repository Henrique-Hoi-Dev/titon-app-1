const errorsMap = {
  VALIDATION_ERROR: 'Erro de validação, parâmetros inválidos',
  'Validation error': 'Erro de validação, parâmetros inválidos',
  USER_NOT_FOUND: 'Usuário não encontrado, verifique as credenciais',
  INVALID_ROLE: 'Função fornecida é inválida',
  INSUFFICIENT_PERMISSIONS: 'O usuário não possui permissão necessária',
  INVALID_USERS_CREDENTIALS: 'Credenciais de usuário inválidas',
  INVALID_USER_PASSWORD: 'Senha incorreta',
  PASSWORDS_NOT_MATCHED: 'Senhas não coincidem',
  CONFLICT_DUPLICATE_KEY_ERROR: 'Conflito com chaves duplicadas',
  INVALID_EMAIL_TYPE: 'Tipo de e-mail inválido',
  API_ENDPOINT_NOT_FOUND: 'Endpoint da API não encontrado',
  USER_NOT_VERIFIED: 'Usuário não verificado',
  INVALID_TOKEN: 'É necessária uma autorização válida',
  FORBIDDEN_RESOURCE: 'Usuário não está autorizado a acessar este recurso',
  INVALID_REFRESH_TOKEN: 'É necessário um token de atualização válido',
  INVALID_ACTION_UPDATE_USER_PASSWORD:
    'Usuário não está autorizado a atualizar a senha de outro usuário',
  VERIFICATION_CODE_NOT_FOUND:
    'Código de verificação do usuário não encontrado',
  CONFLICT_DUPLICATE_KEY_ERROR_CPF: 'Conflito com CPF duplicado',
  INSUFFICIENT_FUNDS: 'Cliente com fundos insuficientes',
  CONFLICT_DUPLICATE_INVOICE_KEY_ERROR:
    'Conflito com chave de fatura duplicada',
  VALIDATION_ERROR_INVOICEKEY_REQUIRED:
    'Erro de validação, chave da fatura é obrigatória',
  VTEX_ORDER_NOT_FOUND: 'Pedido Vtex não encontrado',
  MANAGER_JWT_SECRET_NOT_FOUND: 'Chave secreta do gerente não encontrada',
  DRIVER_JWT_SECRET_NOT_FOUND: 'Chave secreta do motorista não encontrada',
  TOKEN_NOT_FOUND: 'Token não encontrado',
  INVALID_MANAGER_TOKEN: 'Token de gerente inválido',
  INVALID_DRIVER_TOKEN: 'Token de motorista inválido',
  INTERNAL_AUTH_SECRET_KEY_NOT_FOUND:
    'Chave secreta de autenticação interna não encontrada',
  MANAGER_JWT_EXPIRES_IN_NOT_FOUND:
    'Tempo de expiração do JWT do gerente não encontrado',
  DRIVER_JWT_EXPIRES_IN_NOT_FOUND:
    'Tempo de expiração do JWT do motorista não encontrado',
  DRIVER_NOT_FOUND: 'Motorista não encontrado',
  INVALID_DRIVER_PASSWORD: 'Senha de motorista inválida',
  THIS_USER_EMAIL_ALREADY_EXISTS: 'Este e-mail de usuário já existe',
  VERIFY_TOKEN_ERROR_MANAGER_INVALID_TOKEN: 'Token de gerente inválido',
  VERIFY_TOKEN_ERROR_DRIVER_INVALID_TOKEN: 'Token de motorista inválido',
  PERMISSION_NOT_FOUND: 'Permissão não encontrada',
  ERRO_EDIT_USER_PERMISSION: 'Erro ao editar permissão do usuário',
  VERIFY_TOKEN_ERROR_EXPIRED: 'Token expirado',
  PASSWORD_DOES_NOT_MATCH_WITH_THE_CURRENT_PASSWORD:
    'A senha não corresponde à senha atual',
  THIS_TRIP_IS_NOT_IN_PROGRESS_TO_FINALIZE:
    'Esta viagem não está em andamento para ser finalizada',
  FINANCIAL_STATEMENT_NOT_FOUND: 'Extrato financeiro não encontrado',
  TRIP_NOT_FOUND: 'Viagem não encontrada',
  CREDIT_NOT_FOUND: 'Crédito não encontrado',
  CANNOT_DELETE_FINANCIAL_WITH_ACTIVE_FREIGHT:
    'Não é possível excluir financeiro com frete ativo',
  TRIP_IN_PROGRESS: 'Viagem em andamento',
  USER_NOT_IS_MASTER: 'Usuário não é Master',
  USER_NOT_IS_DRIVER: 'Usuário não é Motorista',
  NOTIFICATION_NOT_FOUND: 'Notificação não encontrada',
  CANNOT_UPDATE_READ_NOTIFICATION: 'Não é possível atualizar notificação lida',
  CANNOT_UPDATE_READ_NOTIFICATION_FOR_THIS_NOTIFICATION:
    'Não é possível atualizar notificação lida para esta notificação',
  DRIVERID_NOT_FOUND: 'ID do motorista não encontrado',
  NO_NOTIFICATION_TO_MARK_AS_READ: 'Não há notificação para marcar como lida',
  DRIVER_NOT_HAS_PLAYER_ID: 'Motorista não possui ID do player',
  ERROR_GET_NOTIFICATIONS_PROVIDER: 'Erro ao obter notificações',
  CHASSIS_TRUCK_ALREADY_EXISTS: 'Chassi do caminhão já existe',
  BOARD_TRUCK_ALREADY_EXISTS: 'Placa do caminhão já existe',
  TRUCK_NOT_FOUND: 'Caminhão não encontrado',
  CHASSIS_CART_ALREADY_EXISTS: 'Chassi da carreta já existe',
  BOARD_CART_ALREADY_EXISTS: 'Placa da carreta já existe',
  FINANCIAL_NOT_FOUND: 'Financeiro não encontrado',
  FREIGHT_NOT_FOUND: 'Frete não encontrado',
  CART_NOT_FOUND: 'Carreta não encontrada',
  DEPOSIT_MONEY_NOT_FOUND: 'Depósito de dinheiro não encontrado',
  CATEGORY_OR_TYPE_NOT_FOUND: 'Categoria ou tipo não encontrado',
  DEPOSIT_NOT_FOUND: 'Depósito não encontrado',
  NEED_SOME_PAYMENT: 'Necessário algum pagamento',
  TRIP_NOT_STARTED: 'Viagem não iniciada',
  RESTOCK_NOT_FOUND: 'Reabastecimento não encontrado',
  CANNOT_DELETE_CART_IN_USE: 'Não é possível excluir carreta em uso',
  CANNOT_DELETE_TRUCK_IN_USE: 'Não é possível excluir caminhão em uso',
}

export type ErrorKey = keyof typeof errorsMap

export const getErrorMessage = (error: ErrorKey): string => {
  return errorsMap[error] || 'Erro desconhecido'
}
