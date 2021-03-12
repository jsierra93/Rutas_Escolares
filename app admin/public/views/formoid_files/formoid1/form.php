<?php

define('EMAIL_FOR_REPORTS', '');
define('RECAPTCHA_PRIVATE_KEY', '@privatekey@');
define('FINISH_URI', 'http://');
define('FINISH_ACTION', 'message');
define('FINISH_MESSAGE', 'Thanks for filling out my form!');
define('UPLOAD_ALLOWED_FILE_TYPES', 'doc, docx, xls, csv, txt, rtf, html, zip, jpg, jpeg, png, gif');

define('_DIR_', str_replace('\\', '/', dirname(__FILE__)) . '/');
require_once _DIR_ . '/handler.php';

?>

<?php if (frmd_message()): ?>
<link rel="stylesheet" href="<?php echo dirname($form_path); ?>/formoid-solid-blue.css" type="text/css" />
<span class="alert alert-success"><?php echo FINISH_MESSAGE; ?></span>
<?php else: ?>
<!-- Start Formoid form-->
<link rel="stylesheet" href="<?php echo dirname($form_path); ?>/formoid-solid-blue.css" type="text/css" />
<script type="text/javascript" src="<?php echo dirname($form_path); ?>/jquery.min.js"></script>
<form enctype="multipart/form-data" class="formoid-solid-blue" style="background-color:#FFFFFF;font-size:14px;font-family:'Roboto',Arial,Helvetica,sans-serif;color:#34495E;max-width:480px;min-width:150px" method="post"><div class="title"><h2>Registrar Padres</h2></div>
	<div class="element-input<?php frmd_add_class("input"); ?>" title="ID"><label class="title"><span class="required">*</span></label><div class="item-cont"><input class="large" type="text" name="input" required="required" placeholder="ID"/><span class="icon-place"></span></div></div>
	<div class="element-name<?php frmd_add_class("name1"); ?>"><label class="title"><span class="required">*</span></label><span class="nameFirst"><input placeholder=" Primer Nombre" type="text" size="8" name="name1[first]" required="required"/><span class="icon-place"></span></span><span class="nameLast"><input placeholder=" Segundo Nombre" type="text" size="14" name="name1[last]" required="required"/><span class="icon-place"></span></span></div>
	<div class="element-name<?php frmd_add_class("name2"); ?>"><label class="title"><span class="required">*</span></label><span class="nameFirst"><input placeholder=" Primer Apellido" type="text" size="8" name="name2[first]" required="required"/><span class="icon-place"></span></span><span class="nameLast"><input placeholder=" Segundo Apellido" type="text" size="14" name="name2[last]" required="required"/><span class="icon-place"></span></span></div>
	<div class="element-date<?php frmd_add_class("date"); ?>" title="Fecha Nacimiento"><label class="title"><span class="required">*</span></label><div class="item-cont"><input class="medium" data-format="yyyy-mm-dd" type="date" name="date" required="required" placeholder="Fecha Nacimiento"/><span class="icon-place"></span></div></div>
	<div class="element-date<?php frmd_add_class("date1"); ?>" title="Fecha Exp. Documento"><label class="title"></label><div class="item-cont"><input class="medium" data-format="yyyy-mm-dd" type="date" name="date1" placeholder="Fecha Exp. Documento"/><span class="icon-place"></span></div></div>
	<div class="element-select<?php frmd_add_class("select"); ?>" title="RH"><label class="title"><span class="required">*</span></label><div class="item-cont"><div class="large"><span><select name="select" required="required">

		<option value="A+">A+</option>
		<option value="A-">A-</option>
		<option value="B+">B+</option>
		<option value="B-">B-</option>
		<option value="O+">O+</option>
		<option value="O-">O-</option>
		<option value="AB+">AB+</option>
		<option value="AB-">AB-</option></select><i></i><span class="icon-place"></span></span></div></div></div>
	<div class="element-phone<?php frmd_add_class("phone"); ?>" title="Telefono"><label class="title"><span class="required">*</span></label><div class="item-cont"><input class="large" type="tel" pattern="[+]?[\.\s\-\(\)\*\#0-9]{3,}" maxlength="24" name="phone" required="required" placeholder="Telefono" value=""/><span class="icon-place"></span></div></div>
	<div class="element-phone<?php frmd_add_class("phone1"); ?>" title="Celular"><label class="title"><span class="required">*</span></label><div class="item-cont"><input class="large" type="tel" pattern="\d{3}-\d{3}-\d{4}" maxlength="24" name="phone1" required="required" placeholder="XXX-XXX-XXXX" value=""/><span class="icon-place"></span></div></div>
	<div class="element-input<?php frmd_add_class("input5"); ?>" title="Ocupación"><label class="title"></label><div class="item-cont"><input class="large" type="text" name="input5" placeholder="Ocupación"/><span class="icon-place"></span></div></div>
	<div class="element-input<?php frmd_add_class("input6"); ?>" title="Dirección Trabajo"><label class="title"><span class="required">*</span></label><div class="item-cont"><input class="large" type="text" name="input6" required="required" placeholder="Dirección Trabajo"/><span class="icon-place"></span></div></div>
	<div class="element-phone<?php frmd_add_class("phone2"); ?>" title="Telefono Trabajo"><label class="title"></label><div class="item-cont"><input class="large" type="tel" pattern="[+]?[\.\s\-\(\)\*\#0-9]{3,}" maxlength="24" name="phone2" placeholder="Telefono Trabajo" value=""/><span class="icon-place"></span></div></div>
	<div class="element-email<?php frmd_add_class("email"); ?>" title="Email"><label class="title"></label><div class="item-cont"><input class="large" type="email" name="email" value="" placeholder="Email"/><span class="icon-place"></span></div></div>
	<div class="element-file<?php frmd_add_class("file"); ?>" title="Foto"><label class="title"><span class="required">*</span></label><div class="item-cont"><label class="large" ><div class="button">Cargar</div><input type="file" class="file_input" name="file" required="required"/><div class="file_text">Seleccionar Foto</div><span class="icon-place"></span></label></div></div>
<div class="submit"><input type="submit" value="Enviar"/></div></form><script type="text/javascript" src="<?php echo dirname($form_path); ?>/formoid-solid-blue.js"></script>

<!-- Stop Formoid form-->
<?php endif; ?>

<?php frmd_end_form(); ?>