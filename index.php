<!DOCTYPE html>
<html lang="en">
<head>
  <title>Print Log</title>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  
  <!-- used fonts -->
  <link href="https://fonts.googleapis.com/css?family=Open+Sans:300,300i,400,400i,600,600i,700,700i,800,800i" rel="stylesheet"> 
  
  <!-- unused fonts for now
  <link href="https://fonts.googleapis.com/css?family=Montserrat:100,100i,200,200i,300,300i,400,400i,500,500i,600,600i,700,700i,800,800i,900,900i" rel="stylesheet">
  <link href="https://fonts.googleapis.com/css?family=Source+Sans+Pro:200,200i,300,300i,400,400i,600,600i,700,700i,900,900i" rel="stylesheet">
  <link href="https://fonts.googleapis.com/css?family=Press+Start+2P" rel="stylesheet">
  <link href="https://fonts.googleapis.com/css?family=Roboto:100,100i,300,300i,400,400i,500,500i,700,700i,900,900i" rel="stylesheet"> 
  <link href="https://fonts.googleapis.com/css?family=Oswald:200,300,400,500,600,700" rel="stylesheet"> 
  -->
  
  <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">
  <link rel="stylesheet" href="log.css">
</head>
<body>

<div class="container-fluid header">
	<div class="row form-group no-gutters entry_input">
		<div class="col-sm-1"><input class="form-control input-sm" type="date" id="entry_input_date" placeholder="Date"></div>
		<div class="col-sm-1"><input class="form-control input-sm" type="text" id="entry_input_short_file" placeholder="Short filename"></div>
		<div class="col-sm-5"><input class="form-control input-sm" type="text" id="entry_input_file" placeholder="Filename"></div>
		<div class="col-sm-5 settings">
			<div class="dropdown">
				<button type="button" class="btn btn-success btn-xs dropdown-toggle" id="entry_input_add_setting" data-toggle="dropdown">
					Add
					<span class="glyphicon glyphicon-triangle-bottom"></span>
				</button>
				<div class="dropdown-menu dropdown-menu-right">
						<div class="form-inline">
							<input type="text" class="form-control input-sm" id="entry_input_settingsKey" placeholder="Settings key">
							<span class="input_container">
								<input type="text" class="form-control input-sm" id="entry_input_settingsValue" placeholder="Settings value">
								<input type="button" class="btn btn-primary btn-sm" id="entry_input_settingsAdd" value="Add setting" onclick="" />
							</span>
						</div>
				</div>
			</div>
		</div>
	</div>
</div>

<div class="container-fluid log_lines">
	<div class="row">
		<div class="col-sm-12">
			<div class="centered">
				<ul class="pagination">
					<li>
						<a href="#" aria-label="Previous" class="pagination_no"><span aria-hidden="true">&laquo;</span></a>
					</li>
					
					<li><a href="#" class="pagination_no">1</a></li>
					<li class="active"><span class="pagination_no">2</span></li>
					<li><a href="#" class="pagination_no">3</a></li>
					<li><a href="#" class="pagination_no">4</a></li>
					
					<li>
						<a href="#" aria-label="Next" class="pagination_no"><span aria-hidden="true">&raquo;</span></a>
					</li>
				</ul>
				
				<span class="entries">33 entries</span>
			</div>
		</div>
	</div>
	
	<div class="dark_box"></div>
</div>

<div class="container-fluid footer">
	
</div>

<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js"></script>
<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>
<script type="text/javascript" src="log.js"></script>

</body>
</html>