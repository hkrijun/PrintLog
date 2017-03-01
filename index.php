<!DOCTYPE html>
<html lang="en">
<head>
  <title>Print Log</title>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">
  <link rel="stylesheet" href="log.css">
</head>
<body>

<div class="container-fluid header">
	<!--
	<div class="row">
		<div class="col-xs-2 col-sm-1">Date</div>
		<div class="col-xs-10 col-sm-1">Short filename</div>
		<div class="col-xs-12 col-sm-4">Filename</div>
		<div class="col-xs-12 col-sm-6">Settings</div>
	</div>
	-->
	<div class="row form-group no-gutters entry_input">
		<div class="col-sm-1"><input class="form-control input-sm" type="date" id="entry_input_date" placeholder="Date"></div>
		<div class="col-sm-1"><input class="form-control input-sm" type="text" id="entry_input_short_file" placeholder="Short filename"></div>
		<div class="col-sm-4"><input class="form-control input-sm" type="text" id="entry_input_file" placeholder="Filename"></div>
		<div class="col-sm-6 settings">
			<div class="dropdown">
				<button type="button" class="btn btn-success btn-xs dropdown-toggle" id="entry_input_new_setting" data-toggle="dropdown">
					Settings
					<span class="caret"></span>
				</button>
				<div class="dropdown-menu dropdown-menu-right">
						<div class="form-inline">
							<input type="text" class="form-control input-sm" id="settingsKey" placeholder="Settings key">
							<input type="text" class="form-control input-sm" id="settingsValue" placeholder="Settings value">
							<input type="button" class="btn btn-primary btn-sm" value="Add setting" onclick="" />
						</div>
				</div>
			</div>
		</div>
	</div>
	
</div>

<div class="container-fluid log_lines">
	<div class="dark_box"></div>
</div>

<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js"></script>
<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>
<script type="text/javascript" src="log.js"></script>

</body>
</html>