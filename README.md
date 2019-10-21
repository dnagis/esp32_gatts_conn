#gatts pour action when connects/disconnects
--> led gpio
--> http POST

basé sur
bt -> esp-idf/examples/bluetooth/bluedroid/ble/gatt_server
wifi -> wifi/get_started/station et protocols/esp-http-client

wifi astuces:
faire coexister BT + WIFI bouffe de la mémoire: gestion des erreurs, voir res/log
le server qui reçoit la requête: voir le .js dans res/

