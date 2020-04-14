# gatts pour action when connects/disconnects
* http POST

## basé sur:

bt -> esp-idf/examples/bluetooth/bluedroid/ble/gatt_server

wifi -> protocols/esp-http-client

## WiFi

pour importer la simple helper function, `example_connect()` qui est dans common_components/ et qui simplifie la vie:

	CMakeLists.txt -> set(EXTRA_COMPONENT_DIRS $ENV{IDF_PATH}/examples/common_components/protocol_examples_common)
	Makefile -> EXTRA_COMPONENT_DIRS = $(IDF_PATH)/examples/common_components/protocol_examples_common
	
	***attention s'il y a déjà eu un build avant l'import ne marche pas il faut un make clean***

ssid et pwd se configurent dans le menuconfig (une entrée à la racine)

Attention dans component config / supplicant ne pas mettre print debug messages from WPA Supplicant, sinon le build plante

le server qui reçoit la requête: voir les .js dans res/

## BT + WiFi: problème de mémoire

symptôme: crash au boot alors que make OK: faire coexister BT + WIFI utilise de la mémoire partition

gestion des erreurs, voir res/log
esp_image: Image length 1290592 doesn't fit in partition length 1048576
j'essaie de modifier taille partition, fichier partitions.csv à la racine du projet:

nvs,      data, nvs,     0x9000,  0x6000,
phy_init, data, phy,     0xf000,  0x1000,
factory,  app,  factory, 0x10000, 2M,
 
dans menuconfig il faut dire custom partition table, nom du fichier
 
Partitions defined in '/initrd/mnt/dev_save/esp/esp-idf/examples/gattswifi/partitions.csv' occupy 2.1MB of flash (2162688 bytes) which does not fit in configured flash size 2MB. Change the flash size in menuconfig under the 'Serial Flasher Config' menu.
 
je change le flash size dans serial flasher config à 4M
 
