new Vue({
    el: "#app", // App mount point
	data: {
        // Game board is made of three (3) rows
        // ... each with three (3) columns
        // Totalling a 3x3 board
        row0: [
            {id: 0, value: '', pos: 0},
            {id: 1, value: '', pos: 0},
            {id: 2, value: '', pos: 0}
        ],
        row1: [
            {id: 0, value: '', pos: 0},
            {id: 1, value: '', pos: 0},
            {id: 2, value: '', pos: 0}
        ],
        row2: [
            {id: 0, value: '', pos: 0},
            {id: 1, value: '', pos: 0},
            {id: 2, value: '', pos: 0}
        ],
        // For tracking the current player
        current: 'x',
        // For tracking 'draws'
        isDraw: false,
        // For tracking the winning player
        winner: null,
        // For tracking winning combo pos
        combo: []
    }, // Global App data
    mounted() {
        console.log('Welcome to Tic!')

        console.log("[Tip]\n\t[ - - - ]\n\t[ - x - ]\n\t[ - - - ]\n\nDid you know that playing the middle block first opens up the possibility of getting on of the 5/8 possible winning combos in your next '2' moves?")

        for (var i=0;i<3;i++) {
            this.row0[i].pos = this.getPos(0, i, 3)
        }

        for (var i=0;i<3;i++) {
            this.row1[i].pos = this.getPos(1, i, 3)
        }

        for (var i=0;i<3;i++) {
            this.row2[i].pos = this.getPos(2, i, 3)
        }

        this.row0.forEach((b) => {
            console.log(b.pos)
        })

        this.row1.forEach((b) => {
            console.log(b.pos)
        })

        this.row2.forEach((b) => {
            console.log(b.pos)
        })

        console.log(this.combo)
    },
	methods: {
        getPos(r,c,maxC) {
            d = maxC - 1

            if (r == 0) {
                return r + c + 1
            } else if (r == 1) {
                return r + c + (d+1)
            } else if (r == 2) {
                return r + c + (d+d+1)
            }
        },
        changePlayer() {
            // Rotates current player
            if (this.current == 'x') {
                this.current = 'o'
            } else {
                this.current = 'x'
            }
        },
        fillBlock(row, blockID) {
            // checks if the current block at row`row`[`blockID`] is filled or if there is a winner
            // the proceeds to fill the block if the above is false
            // else the game is restarted
            if (!this.isBlockFilled(row, blockID) && !this.winner) {
                eval(`this.row${row}[${blockID}].value = '${this.current}'`)

                // Checks whether we have a winner or the game is at a draw
                if (this.checkState()) {
                    if (!this.isDraw) {
                        // If we have a winner
                        // we simply set the winner to the current player and reset the current player to 'x' (I.e new game)
                        this.winner = this.current
                        this.current = 'x'
                    } else {
                        // If we detect a draw, we simply restart the game
                        this.restart()
                    }
                } else {
                    // If there are still unfilled blocks and the game is not at a draw, we continue the changing players and allow game to continue
                    if (!this.isDraw) {
                        this.changePlayer()
                    }
                }
            } else {
                // When all the blocks are filled and we know we have a winner
                // then we change the action of clicking a block from just filling the block with the current player to restarting the entire game
                if (this.winner) {
                    this.restart()
                }
            }
        },
        isBlockFilled(row, blockID) {
            // Check if a block at row `row`[`blockID`] has a value already
            return eval(`this.row${row}[${blockID}].value != ''`)
        },
        isFilled() {
            // Checks if there are no more moves to be played
            // I.e all blovks are filled
            let filled = 0

            this.row0.forEach((block) => {
                if (block.value != '') {
                    filled += 1
                }
            })

            this.row1.forEach((block) => {
                if (block.value != '') {
                    filled += 1
                }
            })

            this.row2.forEach((block) => {
                if (block.value != '') {
                    filled += 1
                }
            })

            return filled == (this.row0.length+this.row1.length+this.row2.length)
        },
        checkState() {
            // Check if current player has a winning combo or ran out of moves
            if (this.isFilled()) {
                this.isDraw = true

                // We return true and handle the next action after draw in the initial calling function
                return true
            } else {
                // We inspect all eight (8) possible winning combos
                let row0 = false
                let row1 = false
                let row2 = false
                let col0 = false
                let col1 = false
                let col2 = false
                let diag0 = false
                let diag1 = false

                // Checking rows

                // Combo 1 :-
                //
                //  [ x x x ]
                //  [ | | | ]
                //  [ | | | ]
                //
                // 'x' - filled with current player
                // '|' - empty or filled with other player
                if (this.row0[0].value == this.current && this.row0[1].value == this.current && this.row0[2].value == this.current) {
                    row0 = true
                    this.combo = [1,2,3]
                }

                // Combo 2 :-
                //
                //  [ | | | ]
                //  [ x x x ]
                //  [ | | | ]
                //
                // 'x' - filled with current player
                // '|' - empty or filled with other player
                if (this.row1[0].value == this.current && this.row1[1].value == this.current && this.row1[2].value == this.current) {
                    row1 = true
                    this.combo = [4,5,6]
                }

                // Combo 3 :-
                //
                //  [ | | | ]
                //  [ | | | ]
                //  [ x x x ]
                //
                // 'x' - filled with current player
                // '|' - empty or filled with other player
                if (this.row2[0].value == this.current && this.row2[1].value == this.current && this.row2[2].value == this.current) {
                    row2 = true
                    this.combo = [7,8,9]
                }
                // END

                // Checking cols

                // Combo 4 :-
                //
                //  [ x | | ]
                //  [ x | | ]
                //  [ x | | ]
                //
                // 'x' - filled with current player
                // '|' - empty or filled with other player
                if (this.row0[0].value == this.current && this.row1[0].value == this.current && this.row2[0].value == this.current) {
                    col0 = true
                    this.combo = [1,4,7]
                }

                // Combo 5 :-
                //
                //  [ | x | ]
                //  [ | x | ]
                //  [ | x | ]
                //
                // 'x' - filled with current player
                // '|' - empty or filled with other player
                if (this.row0[1].value == this.current && this.row1[1].value == this.current && this.row2[1].value == this.current) {
                    col1 = true
                    this.combo = [2,5,8]
                }

                // Combo 6 :-
                //
                //  [ | | x ]
                //  [ | | x ]
                //  [ | | x ]
                //
                // 'x' - filled with current player
                // '|' - empty or filled with other player
                if (this.row0[2].value == this.current && this.row1[2].value == this.current && this.row2[2].value == this.current) {
                    col2 = true
                    this.combo = [3, 6, 9]
                }
                // END

                // Checking diag

                // Combo 7 :-
                //
                //  [ x | | ]
                //  [ | x | ]
                //  [ | | x ]
                //
                // 'x' - filled with current player
                // '|' - empty or filled with other player
                if (this.row0[0].value == this.current && this.row1[1].value == this.current && this.row2[2].value == this.current) {
                    diag0 = true
                    this.combo = [1,5,9]
                }

                // Combo 8 :-
                //
                //  [ | | x ]
                //  [ | x | ]
                //  [ x | | ]
                //
                // 'x' - filled with current player
                // '|' - empty or filled with other player
                if (this.row0[2].value == this.current && this.row1[1].value == this.current && this.row2[0].value == this.current) {
                    diag1 = true
                    this.combo = [3,5,7]
                }
                // END

                // If any of the above were discovered then we conclude that the  current player has won
                if (row0 || row1 || row2 || col0 || col1 || col2 || diag0 || diag1) {return true} else {return false}
            }
        },
        restart() {
            // Re-initialize all game variables
            // Start game a-fresh
            this.row0.forEach((block) => {
                block.value = ''
            })

            this.row1.forEach((block) => {
                block.value = ''
            })

            this.row2.forEach((block) => {
                block.value = ''
            })

            this.current = 'x'
            this.winner = null
            this.isDraw = ''
            this.combo = []
        }
    } // Gloabl (mutex) Functions
})
